from fastapi import APIRouter, Depends

from app.api.v1.handles import user, journal
from app.api.v1.auth import jwt
from app.api.v1.handles import response, vectordb
from app.api.v1.handles.questionnaire import questionnaire_router

router = APIRouter()

router.include_router(user.user_router, prefix = "/user", tags =['User'])
router.include_router(response.response_router, prefix = "/chatbot-services", tags =['Chatbot'])
router.include_router(journal.journal_router, prefix = "/journal", tags =['Journal'])
router.include_router(jwt.auth_router, prefix = "/auth", tags =['Auth'])
router.include_router(vectordb.vectordb_router, prefix = "/vectordb", tags =['Vectordb'])
router.include_router(
    questionnaire_router,
    prefix="/questionnaire",
    tags=["Questionnaire"]
)