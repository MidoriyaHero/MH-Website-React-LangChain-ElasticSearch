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
    PROJECT_NAME: str = 'Mental RAG System'
    API_STR: str = 'api'
    API_STR: str = "api"
    JWT_KEY: str = os.getenv('JWT_KEY')
    JWT_REFRESH_KEY: str = os.getenv('JWT_REFRESH_KEY')
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60*24*7 # 7days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    PROJECT_NAME: str = 'MENTALHEALTH APP'
    #Database 
    MONGO_DB: str = os.getenv('MONGO_CONNECTION')
    class Config:
        case_sensitive = False

settings = Settings()