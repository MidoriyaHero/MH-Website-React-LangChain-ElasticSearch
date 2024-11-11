from fastapi import APIRouter, Depends
from app.api.handles import user, journal
from app.api.auth import jwt
#from app.api.handles import load_doc, response

router = APIRouter()
router
router.include_router(user.user_router, prefix = "/user", tags =['User'])
router.include_router(journal.journal_router, prefix = "/journal", tags =['Journal'])
router.include_router(jwt.auth_router, prefix = "/auth", tags =['Auth'])
#router.include_router(load_doc.router_add_doc, prefix = "/rag-services", tags =['VectorStore'])
#router.include_router(response.response_router, prefix = "/chatbot-services", tags =['Chatbot'])