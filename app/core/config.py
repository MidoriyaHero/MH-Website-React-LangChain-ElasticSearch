from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
from typing import List
load_dotenv()

class Settings(BaseSettings):
    GG_API: str = os.getenv('GG_API_KEY')
    JWT_KEY: str = os.getenv('JWT_KEY')
    JWT_REFRESH_KEY: str = os.getenv('JWT_REFRESH_KEY')

    EMBEDING_MODEL: str = 'models/embedding-001'
    INDEX_NAME: str = 'mentalhealth-index'
    ES_URL: str = "http://localhost:9200"
    MODEL_NAME: str = 'gemini-pro'
    PROJECT_NAME: str = 'Mental RAG System'
    API_STR: str = 'api'
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