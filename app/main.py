from fastapi import FastAPI
from app.api import router
from app.core.config import settings
from beanie import init_beanie
from contextlib import asynccontextmanager
from app.models.user_model import User
from app.models.journal_model import DailyJournal
from app.models.history import history
from motor.motor_asyncio import AsyncIOMotorClient
from app.api.router import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup code goes here:
    client: AsyncIOMotorClient = AsyncIOMotorClient(
        settings.MONGO_DB,
    )
    await init_beanie(client.BlogClient, 
                      document_models=[User, DailyJournal, history])
    yield
    # shutdown code goes here:
    client.close()

app = FastAPI(
    title = settings.PROJECT_NAME,
    openapi_url= f'/{settings.API_STR}/openapi.json',
    lifespan=lifespan
)

app.include_router(router, prefix= f'/{settings.API_STR}')