from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from prompt_template import TEMPLATE
from VectorDB.ES import Vectordb

vector_store = Vectordb()
def main(query):
    llm = ChatGoogleGenerativeAI(model="gemini-pro")
    #prompt = hub.pull("rlm/rag-prompt")
    prompt=ChatPromptTemplate.from_template(TEMPLATE)
    retriever = vector_store.as_retriever(
        search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.9}
        )
    rag_chain=(
        {"context":retriever,"question":RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    response=rag_chain.invoke(query)
    return response