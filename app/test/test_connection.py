from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import app.VectorDB.ES as vector

test_connection = APIRouter()


class Query(BaseModel):
    query: str
@test_connection.post("/testVectorDB")
async def query(items: Query):
    try:
        vector_store = vector.Vectordb()
        query = items.query
        context = vector_store.search(query)
        return context
    except Exception as e:
        raise HTTPException(status_code = 500, detail = e)