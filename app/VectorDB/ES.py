from dotenv import load_dotenv
import os
from langchain_openai import OpenAIEmbeddings
import getpass
from langchain_elasticsearch import ElasticsearchStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv('GG_API_KEY')
EMBEDING_MODEL = os.getenv('EMBEDDING_MODEL_NAME')
INDEX_NAME = os.getenv('INDEX_NAME')
ES_URL = os.getenv('ES_URL')
MODEL_NAME = os.getenv('MODEL_NAME')


class Vectordb():

    if EMBEDING_MODEL == 'models/embedding-001':
    #set up for using gg embeding model
        def _init():
            embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDING_MODEL, task_type= 'retrieval_document')
            vector_store = ElasticsearchStore(
                index_name=INDEX_NAME,
                embedding=embeddings, 
                es_url=ES_URL,
            )
            return vector_store
        
    def load_doc(self, document)-> Document:
        self.loader = PyPDFLoader(file_path = document, extract_images = True,) #document can be path or file in DB
        self.document = self.loader.load_and_split()
        return self.document
    
    def add_doc(self, vector_store):
        vector_store.add_documents(documents=self.document)