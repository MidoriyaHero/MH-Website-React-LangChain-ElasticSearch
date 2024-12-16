from fastapi import APIRouter, HTTPException, Depends
from typing import List
from langchain_core.documents import Document
from uuid import UUID

from app.models.UserModel import User
from app.api.test.dependency.UserDependency import get_current_user

from app.services.Test import ChatService
from app.schemas.ResponseSchema import Message


response_router = APIRouter()

def format_docs(docs: List[Document]):
        return [doc.page_content for doc in docs]
@response_router.post("/Single-query/", response_model= Message)
async def single_query(query: str):
    try:
        response = await ChatService.response(query)
        return response
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)

@response_router.post('/chat/{session_id}', response_model = Message)
async def chat(query: str, session_id: UUID, current_user: User = Depends(get_current_user)):
    return await ChatService.chat(query=query,user = current_user, session_id=session_id)

@response_router.post("/createSession")
async def create_session( session_name: str,current_user: User = Depends(get_current_user)):
    return await ChatService.createSession(current_user, session_name)

@response_router.get("/listSession")
async def list_session(current_user: User = Depends(get_current_user)):
    return await ChatService.listChatSession(current_user)

@response_router.get('/getSession/{session_id}')
async def get_session(session_id: UUID, current_user: User = Depends(get_current_user)):
    return await ChatService.retrieveSession(session_id, current_user)
@response_router.put('/renameSession/{session_id}')
async def rename_session(session_id: UUID, name: str, current_user: User = Depends(get_current_user)):
    return await ChatService.updateSessionName(user=current_user, sessionid=session_id, name=name)

@response_router.delete('/deleteSession/{session_id}')
async def delete_session(session_id: UUID, current_user: User = Depends(get_current_user)):
    await ChatService.deleteSession(user=current_user,sessionid= session_id)
    return {'Messages':'Deleted session'}

@response_router.get('/listMessages/{session_id}')
async def list_messages(session_id: UUID, current_user: User = Depends(get_current_user)):
    return await ChatService.retrieveChatfromSession(user=current_user,sessionid= session_id)
