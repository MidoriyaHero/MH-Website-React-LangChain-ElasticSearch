from fastapi import APIRouter, Depends
from app.api.handles import load_doc, response


router = APIRouter()
router.include_router(load_doc.router_add_doc, prefix = "/rag-services", tags =['rag'])
router.include_router(response.response_router, prefix = "/chatbot-services", tags =['chatbot'])