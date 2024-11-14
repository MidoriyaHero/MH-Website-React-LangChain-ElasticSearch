from fastapi import APIRouter, HTTPException, Depends
from app.schemas.response_schema import Response
from app.services.chat_service import Response_service
from typing import List
from app.models.user_model import User
from app.api.dependency.user_dependency import get_current_user
from langchain_core.documents import Document
from app.services.test import test_history

response_router = APIRouter()

def format_docs(docs: List[Document]):
        return [doc.page_content for doc in docs]
@response_router.get("/Single-query/", response_model= Response)
async def single_query(query: str):
    try:
        response = Response_service.response(query)
        format_doc = format_docs(response['context'])
        dict_response = {
            'input': response['question'],
            'context': format_doc,
            'answer': response['answer']
        }
        return Response(**dict_response)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)
    

@response_router.get('/test_chat')
async def test(query: str, current_user: User = Depends(get_current_user)):
    return test_history(query, current_user)

@response_router.get('/chat/{user}')
async def chat(query: str, current_user: User = Depends(get_current_user)):
     pass