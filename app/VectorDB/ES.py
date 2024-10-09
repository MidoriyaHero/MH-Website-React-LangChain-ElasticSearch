from dotenv import load_dotenv
import os
from langchain_openai import OpenAIEmbeddings
import getpass
from langchain_elasticsearch import ElasticsearchStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

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