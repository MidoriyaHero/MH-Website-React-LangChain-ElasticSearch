from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.Response import response


response_router = APIRouter()

class Query(BaseModel):
    query: str

@response_router.post("/GetResponse/{items}")
async def query(items: str):
    try:
        #query = items.query
        return response(items)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Internal server error")
    
@response_router.get("/GetResponse/{items}")
async def query(items: str):
    try:
        #query = items.query
        return {'query': items, 
                'response':response(items)}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Internal server error")