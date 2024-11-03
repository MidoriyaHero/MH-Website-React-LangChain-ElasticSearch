from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.Response import response


response_router = APIRouter()


@response_router.get("/GetResponse/{items}")
async def query(items: str):
    try:
        return {'query': items, 
                'response':response(items)}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Internal server error")