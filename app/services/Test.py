from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from openai import OpenAI

from typing import List
import os
from uuid import UUID

from app.prompt_template.template import TEMPLATE, prompt_history
from app.models.UserModel  import User
from app.core.config import settings
from app.schemas.ResponseSchema import Message
from app.models.HistoryModel import HistoryMessage, Session


class ChatService:
    @staticmethod
    async def listChatSession(user: User) -> list[Session]:
        sessions = await Session.find(Session.owner.id == user.id).to_list()
        return sessions
    
    @staticmethod
    async def retrieveChatfromSession(sessionid: UUID, user: User) -> list[HistoryMessage]:
        session = await ChatService.retrieveSession(sessionid, user)
        messages = await HistoryMessage.find(HistoryMessage.session.id == session.id).to_list()
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
    async def deleteChat(user: User, sessionid: UUID) -> HistoryMessage:
        messages = await ChatService.retrieveChatfromSession(sessionid=sessionid, user= user)
        for message in messages:
            await message.delete()

    @staticmethod
    async def deleteSession(user:User, sessionid: UUID)-> Session:
        session = await ChatService.retrieveSession(sessionid=sessionid,user=user)
        if session:
            await ChatService.deleteChat(user=user,sessionid=sessionid)
            await session.delete()
        else:
            return None
        
    @staticmethod
    async def createMessage(session: Session, role: str, content: str) -> HistoryMessage:
        message = HistoryMessage(role=role, content=content, session=session)
        return await message.insert()
    
    @staticmethod
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    
    @staticmethod
    async def response(query):
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": query}
            ]
            )

        print(completion.choices[0].message.content)

        # Extract and return the reply from the model
        response = completion.choices[0].message.content

        return ({"content": response, 'role':'bot'})
    @staticmethod
    async def chat(user: User, query: str, session_id: UUID):
        #todo create chat session and store in database
        session = await ChatService.retrieveSession(session_id, user)
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": query}
            ]
            )

        print(completion.choices[0].message.content)

        # Extract and return the reply from the model
        response = completion.choices[0].message.content
        #add chat to DB
        await ChatService.createMessage(session, role='user', content=query)
        await ChatService.createMessage(session, role='system', content=response)
        return {'role':'system', 'content': response}
        
        