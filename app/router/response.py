from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.Response import response


response_router = APIRouter()

class Query(BaseModel):
    query: str

@response_router.post("/GetResponse")
async def query(items: Query):
    try:
        query = items.query
        return response(query)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Internal server error")