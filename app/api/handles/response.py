from fastapi import APIRouter, HTTPException
from app.schemas.response_schema import Response
from app.services.Response_service import Response_service


response_router = APIRouter()


@response_router.get("/GetResponse/")
async def query(items: str):
    try:
        return Response_service.response(items)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)