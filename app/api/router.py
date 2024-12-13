from fastapi import APIRouter, Depends

from app.api.test.handles import user, journal
from app.api.test.auth import jwt
from app.api.test.handles import response

router = APIRouter()

router.include_router(user.user_router, prefix = "/user", tags =['User'])
router.include_router(response.response_router, prefix = "/chatbot-services", tags =['Chatbot'])
router.include_router(journal.journal_router, prefix = "/journal", tags =['Journal'])
router.include_router(jwt.auth_router, prefix = "/auth", tags =['Auth'])
