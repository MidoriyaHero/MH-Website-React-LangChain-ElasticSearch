from fastapi import APIRouter, HTTPException, File,UploadFile
from typing import List

from app.services.VectorStore_service import Vectordb_service

vectordb_router = APIRouter()
vector_service = Vectordb_service()

@vectordb_router.post('/file/AddDocument')
async def add_document(files: List[UploadFile] = File(...)):
    for file in files:
        try:
            #to do: thêm phần time adding file trong mongodb
            vector_service.load(file)
            return {"message": 'File added!', "filename": file.filename}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing {file.filename}, {str(e)}")
        
#todo: them update, delete

@vectordb_router.get('/search')
async def search(query: str):
    try:
        docs = vector_service.search(query=query)
        return "\n\n".join(doc.page_content for doc in docs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")