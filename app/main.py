from fastapi import FastAPI
from app.api.services import response, load_doc
from app.test import test_connection

app = FastAPI(
    title= "RAG Chatbot API",
    version = "0.0.1",
)
app.include_router(response.response_router)
app.include_router(load_doc.router_add_doc)
app.include_router(test_connection.test_connection)