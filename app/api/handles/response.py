from fastapi import APIRouter, HTTPException
from app.schemas.response_schema import Response
from app.services.Response_service import Response_service
from typing import List
from langchain_core.documents import Document

response_router = APIRouter()

def format_docs(docs: List[Document]):
        return [doc.page_content for doc in docs]
@response_router.get("/GetResponse/", response_model= Response)
async def query(query: str):
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