from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document

from app.prompt_template.template import TEMPLATE, standalone_system_prompt
from app.services.VectorStore_service import Vectordb_service
from app.models.user_model  import User
from app.core.config import settings
from app.schemas.response_schema import ResponseHis
from app.models.history import history

from typing import List
import os
from uuid import UUID

vectordb = Vectordb_service()
class Response_service:

    def __init__(self):
        #todo specify all variables needed
        pass
    @staticmethod
    def get_session_history(session_id: UUID) -> MongoDBChatMessageHistory:
        return MongoDBChatMessageHistory(settings.MONGO_DB, session_id, database_name='BlogClient', collection_name="history")
    
    @staticmethod
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    
    @staticmethod
    async def response(query):
        llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18",temperature=0, openai_api_key=settings.OPENAI_API_KEY)
        #llm = ChatGoogleGenerativeAI(model="gemini-pro")
        #prompt = hub.pull("rlm/rag-prompt")
        prompt=ChatPromptTemplate.from_template(TEMPLATE)
        retriever = vectordb.as_retriever()

        rag_chain_from_docs = (
            RunnablePassthrough.assign(context=(lambda x: Response_service.format_docs(x["context"])))
            | prompt
            | llm
            | StrOutputParser()
        )

        retrieve_docs = (lambda x: x["question"]) | retriever

        chain = RunnablePassthrough.assign(context=retrieve_docs).assign(
            answer=rag_chain_from_docs
        )

        return chain.invoke({"question": query})
    
    def chat(query: str, user: User):
        #todo create chat session and store in database
        if user:
            parse_output = StrOutputParser()
            vectordb = Vectordb_service()
            retriever = vectordb.as_retriever()

            standalone_question_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", standalone_system_prompt),
                    MessagesPlaceholder(variable_name="history"),
                    ("human", "{question}"),
                ]
            )

            llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18",temperature=0, openai_api_key=settings.OPENAI_API_KEY)
            question_chain = standalone_question_prompt | llm | parse_output
            retriever_chain = RunnablePassthrough.assign(context=question_chain | retriever | (lambda docs: "\n\n".join([d.page_content for d in docs])))
            rag_system_prompt = """Answer the question based only on the following context: \
            {context}
            """
            rag_prompt = ChatPromptTemplate.from_messages(
                [
                    ("system", rag_system_prompt),
                    MessagesPlaceholder(variable_name="history"),
                    ("human", "{question}"),
                ]
            )
            # RAG chain
            rag_chain = (
                retriever_chain
                | rag_prompt
                | llm
                | parse_output
            )

            # RAG chain with history
            with_message_history = RunnableWithMessageHistory(
                rag_chain,
                Response_service.get_session_history,
                input_messages_key="question",
                history_messages_key="history",
            )
            response = with_message_history.invoke(
                                                    {'question': query},
                                                    {'configurable': {'session_id': str(user.user_id)}})
            return response
        
        else:
            raise Exception("User not found")
        
    def history_chat(query: str, user: User):
        #todo retrieve chat session from database to show on UI
        pass

    def delete_chat(query: str, user: User):
        #todo delete chat session from database
        pass

# # Add single message
# history.add_message(message)

# # Add batch messages
# history.add_messages([message1, message2, message3, ...])

# # Add human message
# history.add_user_message(human_message)

# # Add ai message
# history.add_ai_message(ai_message)

# # Retrieve messages
# messages = history.messages

#The architechture should follow: https://community.aws/content/2j9daS4A39fteekgv9t1Hty11Qy/managing-chat-history-at-scale-in-generative-ai-chatbots?lang=en