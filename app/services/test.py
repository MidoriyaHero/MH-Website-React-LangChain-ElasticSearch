from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from app.prompt_template.template import TEMPLATE, standalone_system_prompt
from app.services.VectorStore_service import Vectordb_service
from typing import List
from langchain_core.documents import Document
from app.models.user_model  import User
from app.schemas.response_schema import ResponseHis
from app.core.config import settings
from langchain_openai import ChatOpenAI
import os

parse_output = StrOutputParser()
vectordb = Vectordb_service()
retriever = vectordb.as_retriever()

def get_session_history(session_id: str) -> MongoDBChatMessageHistory:
    return MongoDBChatMessageHistory(settings.MONGO_DB, session_id, database_name='BlogClient', collection_name="history")

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
    get_session_history,
    input_messages_key="question",
    history_messages_key="history",
)

def test_history(query, session_id):
    response = with_message_history.invoke(
        {'question': query},
        {'configurable': {'session_id': session_id}}
    )
    return ResponseHis(input=query, answer=response)  
