from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document

from typing import List
import os
from uuid import UUID


from app.services.VectorStoreService import Vectordb_service
from app.models.UserModel  import User
from app.core.config import settings
from app.schemas.ResponseSchema import Message
from app.models.HistoryModel import HistoryMessage, Session
from app.services.Agent import PersonalizedAgent
from app.services.QuestionnaireService import QuestionnaireService
from app.services.JournalService import JournalService


vectordb = Vectordb_service()
class ChatService:
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
    async def deleteChat(session: Session) -> HistoryMessage:
        messages = await ChatService.retrieveChatfromSession(session)
        for message in messages:
            await message.delete()

    @staticmethod
    async def deleteSession(user:User, sessionid: UUID)-> Session:
        session = await ChatService.retrieveSession(sessionid,user)
        if session:
            await ChatService.deleteChat(session)
            await session.delete()
        else:
            return None
        
    @staticmethod
    async def createMessage(session: Session, role: str, content: str) -> HistoryMessage:
        message = HistoryMessage(role=role, content=content, session=session)
        return await message.insert()
    
    @staticmethod
    def get_session_history(session_id: UUID) -> MongoDBChatMessageHistory:
        return MongoDBChatMessageHistory(settings.MONGO_DB, session_id, database_name='BlogClient', collection_name="History")

    @staticmethod
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    
    @staticmethod
    async def response(query):
        llm = ChatOpenAI(model="gpt-4o-mini",temperature=0, openai_api_key=settings.OPENAI_API_KEY)
        #llm = ChatGoogleGenerativeAI(model="gemini-pro")
        #prompt = hub.pull("rlm/rag-prompt")
        prompt=ChatPromptTemplate.from_template(TEMPLATE)
        retriever = vectordb.as_retriever()

        rag_chain_from_docs = (
            RunnablePassthrough.assign(context=(lambda x: ChatService.format_docs(x["context"])))
            | prompt
            | llm
            | StrOutputParser()
        )

        retrieve_docs = (lambda x: x["question"]) | retriever

        chain = RunnablePassthrough.assign(context=retrieve_docs).assign(
            answer=rag_chain_from_docs
        )

        return chain.invoke({"question": query})
    @staticmethod
    async def chat(user: User, query: str, session_id: UUID):
        session = await ChatService.retrieveSession(sessionid=session_id, user=user)
        if session:
            # Initialize LLM and PersonalizedAgent
            llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
            agent = PersonalizedAgent(llm)
            
            # Update agent's context with user's data
            agent.context_manager.questionnaire_history = await QuestionnaireService.get_user_questionnaire_history(user)
            agent.context_manager.daily_journals = await JournalService.list_journals(user)
            agent.context_manager.chat_history = await ChatService.retrieveChatfromSession(sessionid=session_id, user=user)
            
            # Get personalized response from agent and format as Message
            response_text = await agent.run(query)
            # Store chat in DB
            await ChatService.createMessage(session, role='user', content=query)
            await ChatService.createMessage(session, role='system', content=response_text)
            
            # Return formatted response
    

            return {
                'role': 'system',
                'content': response_text
            }
        else:
            raise Exception("Session not found")
        