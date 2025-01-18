from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document

from typing import List
import os
from uuid import UUID

from app.agent.personalized_chat_agent import PersonalizedChatAgent
from app.models.UserModel  import User
from app.core.config import settings
from app.schemas.ResponseSchema import Message
from app.models.HistoryModel import HistoryMessage, Session
from app.services.QuestionnaireService import QuestionnaireService
from app.services.JournalService import JournalService



class ChatService:
    llm = ChatOpenAI(model="gpt-4o-mini",temperature=0, openai_api_key=settings.OPENAI_API_KEY)
    @staticmethod
    async def listChatSession(user: User) -> list[Session]:
        sessions = await Session.find(Session.owner.id == user.id).to_list()
        return sessions
    
    @staticmethod
    async def retrieveChatfromSession(sessionid: UUID, user: User) -> list[HistoryMessage]:
        # First get the session
        session = await Session.find_one(Session.session_id == sessionid, Session.owner.id == user.id)
        if not session:
            return []
        
        # Then get messages for that session
        messages = await HistoryMessage.find(HistoryMessage.session.id == session.id).sort("+create_at").to_list()
        return messages
    
    @staticmethod
    async def createSession(user: User, session_name:str) -> Session:
        session = Session(session_name=session_name, owner=user)
        return await session.insert()
    
    @staticmethod
    async def retrieveSession(sessionid: UUID, user: User)-> Session:
        session = await Session.find_one(Session.session_id == sessionid, Session.owner.id == user.id)
        return session
    
    @staticmethod
    async def updateSessionName( user: User, sessionid: UUID, name: str) -> Session:
        session = await ChatService.retrieveSession(user=user,sessionid= sessionid)
        await session.update({"$set": {"session_name": name}})
        await session.save()
        return session
    
    @staticmethod 
    async def deleteChat(session: Session, user: User) -> HistoryMessage:
        messages = await ChatService.retrieveChatfromSession(session, user)
        for message in messages:
            await message.delete()

    @staticmethod
    async def deleteSession(user:User, sessionid: UUID)-> Session:
        session = await ChatService.retrieveSession(sessionid,user)
        if session:
            await ChatService.deleteChat(session, user)
            await session.delete()
        else:
            return None
        
    @staticmethod
    async def createMessage(session: Session, role: str, content: str) -> HistoryMessage:
        message = HistoryMessage(role=role, content=content, session=session)
        return await message.insert()
    
    @staticmethod
    async def chat(user: User, query: str, session_id: UUID):
        session = await ChatService.retrieveSession(sessionid=session_id, user=user)
        if not session:
            raise Exception("Session not found")
            
        # Initialize agent with user context
        llm = ChatOpenAI(model="gpt-4o", temperature=0)
        agent = PersonalizedChatAgent(llm,user)
        
        # Get user context
        questionnaire_history = await QuestionnaireService.get_user_questionnaire_history(user)
        daily_journals = await JournalService.list_journals(user)
        chat_history = await ChatService.retrieveChatfromSession(sessionid=session_id, user=user)
        
        # Update agent context
        agent.context_manager.questionnaire_history = questionnaire_history
        agent.context_manager.daily_journals = daily_journals
        agent.context_manager.chat_history = chat_history
        
        # Get response
        response_text = await agent.run(query)
        
        # Store chat in DB
        await ChatService.createMessage(session, role='user', content=query)
        await ChatService.createMessage(session, role='system', content=response_text)
        
        return {
            'role': 'system',
            'content': response_text
        }
        