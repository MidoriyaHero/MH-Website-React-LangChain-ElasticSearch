from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
from typing import List

load_dotenv()

class Settings(BaseSettings):
    GG_API: str = os.getenv('GG_API_KEY')
    OPENAI_API_KEY: str = os.getenv('OPENAI_API_KEY')
    JWT_KEY: str = os.getenv('JWT_KEY')
    JWT_REFRESH_KEY: str = os.getenv('JWT_REFRESH_KEY')
    EMAIL_PASS: str  = os.getenv('EMAIL_PASS')
    EMAIL_USER: str = os.getenv('EMAIL_USER')
    SMTP_SERVER: str = os.getenv('SMTP_SERVER')
    SMTP_PORT: str = os.getenv('SMTP_PORT')
    EMBEDING_MODEL: str = 'models/embedding-001'
    INDEX_NAME: str = 'mentalhealth'
    ES_URL: str = "http://localhost:9200"
    MODEL_NAME: str = 'gemini-pro'
    PROJECT_NAME: str = 'Mental RAG System'
    API_STR: str = 'api/v1'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60*24*7
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60*24*7 # 7days
    BACKEND_CORS_ORIGINS: List[str] = ['http://localhost:3000',
'http://34.81.97.201',
'http://lumos.id.vn']
    PROJECT_NAME: str = 'MENTALHEALTH APP'

    #Database 
    MONGO_DB: str = os.getenv('MONGO_CONNECTION')
    class Config:
        case_sensitive = False

settings = Settings()
