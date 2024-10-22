from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from app.prompt_template.template import TEMPLATE
import app.config.ES as vector


def response(query):
    vector_store = vector.Vectordb()
    llm = ChatGoogleGenerativeAI(model="gemini-pro")
    #prompt = hub.pull("rlm/rag-prompt")
    prompt=ChatPromptTemplate.from_template(TEMPLATE)
    retriever = vector_store.as_retriever()
    rag_chain=(
        {"context":retriever,"question":RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    response=rag_chain.invoke(query)
    return response