from fastapi import FastAPI
from app.router import response
from app.test import test_connection

app = FastAPI(
    title= "RAG Chatbot API",
    version = "0.0.1",
)
app.include_router(response.response_router)
app.include_router(test_connection.test_connection)