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

from app.prompt_template.template import TEMPLATE, standalone_system_prompt
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
        messages = await HistoryMessage.find(HistoryMessage.SessionId == sessionid).to_list()
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
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    
    @staticmethod
    async def response(query):
        llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18",temperature=0, openai_api_key=settings.OPENAI_API_KEY)
        #llm = ChatGoogleGenerativeAI(model="gemini-pro")
        #prompt = hub.pull("rlm/rag-prompt")
        prompt=ChatPromptTemplate.from_template(TEMPLATE)

        rag_chain_from_docs = (
            RunnablePassthrough.assign(context=(lambda x: ChatService.format_docs(x["context"])))
            | prompt
            | llm
            | StrOutputParser()
        )


        chain = RunnablePassthrough.assign().assign(
            answer=rag_chain_from_docs
        )

        return chain.invoke({"question": query})
    @staticmethod
    async def chat(user: User, query: str, session_id: UUID):
        #todo create chat session and store in database
        session = await ChatService.retrieveSession(session_id, user)
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        try:
        # Call OpenAI's ChatGPT model
            response = client.chat.completions.create(
                messages=[
                            {
                                "role": "user",
                                "content": query,
                            }
                        ],
                model="gpt-4o",
                
            )
            # Extract and return the reply from the model
            response = response.choices[0].message.content
        except :
            raise Exception

        #add chat to DB
        ChatService.createMessage(session, role='user', content=query)
        ChatService.createMessage(session, role='system', content=response)
        return {'role':'system', 'content': response}
        
        