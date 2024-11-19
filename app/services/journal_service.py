from typing import List 
from uuid import UUID

from app.models.user_model  import User
from app.models.journal_model import DailyJournal
from app.schemas.journal_schema import JournalCreate, JournalUpdate


class JournalService:
    @staticmethod 
    async def list_journals(user: User) -> List[DailyJournal]:
        journals = await DailyJournal.find(DailyJournal.owner.id == user.id).to_list()
        return journals
    
    @staticmethod
    async def create( user: User, data: JournalCreate) -> DailyJournal:
        journal = DailyJournal(**data.model_dump(), owner = user)
        return await journal.insert()
    
    @staticmethod
    async def retrieve( user: User, journal_id: UUID):
        journal = await DailyJournal.find_one(DailyJournal.journal_id == journal_id, DailyJournal.owner.id == user.id)
        print(journal)
        return journal
    
    @staticmethod
    async def update_journal( user: User, journal_id: UUID, data: JournalUpdate) -> DailyJournal:
        journal = await JournalService.retrieve(user, journal_id)
        await journal.update({"$set": data.model_dump(exclude_unset = True)})
        await journal.save()
        return journal
    
    @staticmethod
    async def delete_journal( user: User, journal_id: UUID) -> DailyJournal:
        journal = await JournalService.retrieve(user, journal_id)
        if journal:
            await journal.delete()
        return None