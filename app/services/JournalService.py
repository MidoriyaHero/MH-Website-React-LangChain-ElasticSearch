from typing import List 
from uuid import UUID
from datetime import datetime

from app.models.UserModel import User
from app.models.JournalModel import DailyJournal
from app.schemas.JournalSchema import JournalCreate, JournalUpdate
from app.agent.journal_evaluation_agent import JournalEvaluationAgent
from langchain_openai import ChatOpenAI
from app.core.config import settings

class JournalService:
    # Create evaluation_agent as a class attribute
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
    evaluation_agent = JournalEvaluationAgent(llm)
    
    @staticmethod 
    async def list_journals(user: User) -> List[DailyJournal]:
        journals = await DailyJournal.find(DailyJournal.owner.id == user.id).to_list()
        return journals
    
    @staticmethod
    async def create(user: User, data: JournalCreate) -> DailyJournal:
        journal = DailyJournal(**data.model_dump(), owner=user)
        # Only evaluate if not evaluated before
        if not journal.is_evaluated:
            # Use the class attribute instead of instance attribute
            evaluation = await JournalService.evaluation_agent.evaluate(data.description, user)
            journal.sentiment_analysis = evaluation.get("sentiment")
            journal.emotions = evaluation.get("emotions", [])
            journal.themes = evaluation.get("themes", [])
            journal.is_evaluated = True
            journal.last_evaluated_at = datetime.now()
        return await journal.insert()
    
    @staticmethod
    async def retrieve(user: User, journal_id: UUID):
        journal = await DailyJournal.find_one(DailyJournal.journal_id == journal_id, DailyJournal.owner.id == user.id)
        return journal
    
    @staticmethod
    async def update_journal(user: User, journal_id: UUID, data: JournalUpdate) -> DailyJournal:
        journal = await JournalService.retrieve(user, journal_id)
        journal.is_modified = True
        # Re-evaluate only if content changed and not yet evaluated
        if data.description:
            # Use the class attribute instead of instance attribute
            evaluation = await JournalService.evaluation_agent.evaluate(data.description, user)
            data.sentiment_analysis = evaluation.get("sentiment")
            data.emotions = evaluation.get("emotions", [])
            data.themes = evaluation.get("themes", [])
            data.is_evaluated = True
            data.last_evaluated_at = datetime.now()
        print(data)
        await journal.update({"$set": data.model_dump(exclude_unset=True)})
        await journal.save()
        return journal
    
    @staticmethod
    async def delete_journal(user: User, journal_id: UUID) -> DailyJournal:
        journal = await JournalService.retrieve(user, journal_id)
        if journal:
            await journal.delete()
        return None