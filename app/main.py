from fastapi import FastAPI
from app.router import response


app = FastAPI(
    title= "RAG Chatbot API",
    version = "0.0.1",
)
app.include_router(response.router)
