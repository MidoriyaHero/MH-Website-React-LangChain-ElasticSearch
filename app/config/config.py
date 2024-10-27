from pydantic import BaseSettings, AnyHttpUrl
from dotenv import load_dotenv
import os
from typing import List
load_dotenv()

class Settings(BaseSettings):
    os.environ["GOOGLE_API_KEY"] = os.getenv('GG_API_KEY')
    EMBEDING_MODEL: str = os.getenv('EMBEDDING_MODEL_NAME')
    INDEX_NAME: str = os.getenv('INDEX_NAME')
    ES_URL: str = os.getenv('ES_URL')
    MODEL_NAME: str = os.getenv('MODEL_NAME')
    MONGO_CONNECTION: str = os.getenv('MONGO_CONNECTION')

settings = Settings()