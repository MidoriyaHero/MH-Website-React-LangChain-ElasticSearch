from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import app.config.ES as vector

test_connection = APIRouter()


@test_connection.get("/testVectorDB/{items}")
async def query(items: str):
    try:
        vector_store = vector.Vectordb()
        query = items
        context = vector_store.search(query)
        return context
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)