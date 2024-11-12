from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from app.prompt_template.template import TEMPLATE
from app.services.VectorStore_service import Vectordb_service
from typing import List
from langchain_core.documents import Document


vectordb = Vectordb_service()
class Response_service:
    @staticmethod
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    @staticmethod
    def response(query):
        
        llm = ChatGoogleGenerativeAI(model="gemini-pro")
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


        response=chain.invoke({"question": query})
        return response