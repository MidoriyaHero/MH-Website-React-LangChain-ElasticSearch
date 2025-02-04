from fastapi import FastAPI
from beanie import init_beanie
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware

from app.api import router
from app.core.config import settings
from app.models.UserModel import User
from app.models.JournalModel import DailyJournal
from app.models.HistoryModel import Session, HistoryMessage
from app.api.router import router
from app.models.QuestionnaireModel import QuestionnaireResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup code goes here:
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        settings.MONGO_DB,
    )
    await init_beanie(client.BlogClient, 
                      document_models=[User, DailyJournal, Session, HistoryMessage, QuestionnaireResponse])
    yield
    # shutdown code goes here:
    client.close()

app = FastAPI(
    title = settings.PROJECT_NAME,
    openapi_url= f'/{settings.API_STR}/openapi.json',
    lifespan=lifespan
)
origin = settings.BACKEND_CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins = origin,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

app.include_router(router, prefix= f'/{settings.API_STR}')