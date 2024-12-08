from fastapi import APIRouter, HTTPException, Depends
from typing import List
from langchain_core.documents import Document

from app.models.UserModel import User
from app.api.dependency.UserDependency import get_current_user
from app.services.Test import test_history
from app.services.ChatService import Response_service
from app.schemas.ResponseSchema import Response
from app.services.ChatService import Response_service

response_router = APIRouter()

def format_docs(docs: List[Document]):
        return [doc.page_content for doc in docs]
@response_router.post("/Single-query/", response_model= Response)
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
    

@response_router.post('/chat/{user}')
async def chat(query: str, current_user: User = Depends(get_current_user)):
    return Response_service.chat(query, current_user)