from dotenv import load_dotenv
import os
from langchain_openai import OpenAIEmbeddings
from langchain_elasticsearch import ElasticsearchStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from typing import List

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv('GG_API_KEY')
EMBEDING_MODEL = os.getenv('EMBEDDING_MODEL_NAME')
INDEX_NAME = os.getenv('INDEX_NAME')
ES_URL = os.getenv('ES_URL')
MODEL_NAME = os.getenv('MODEL_NAME')

class Vectordb:
    #set up for using gg embeding model
    def __init__(self):
        if EMBEDING_MODEL == 'models/embedding-001':
            embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDING_MODEL, task_type= 'retrieval_document')
            self.vector_store = ElasticsearchStore(
                index_name=INDEX_NAME,
                embedding=embeddings, 
                es_url=ES_URL,
            )
            self.vector_store
        else:
            raise Exception('Invalid embedding model')
        
    def as_retriever(self):
        return self.vector_store.as_retriever(search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.9})
    
    def search(self, query: str) -> List:
        retriever = self.vector_store.as_retriever(
        search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.9}
        )
        context = retriever.invoke(query)
        return context
    #Old versions for testing
    def load_doc(self, document: str)-> Document:
        self.loader = PyPDFLoader(file_path = document, extract_images = True,) #document can be path or file in DB
        self.document = self.loader.load_and_split()
        return self.document
    
    def add_doc(self, documents: List[Document]):
        # Add documents directly to Elasticsearch
        self.vector_store.add_documents(documents=documents)
