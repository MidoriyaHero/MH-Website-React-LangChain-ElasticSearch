from fastapi import APIRouter, HTTPException, File,UploadFile
from app.services.load_doc import load
from typing import List

router_add_doc = APIRouter()

@router_add_doc.post('/file/AddDocument')
async def add_document(files: List[UploadFile] = File(...)):
    for file in files:
        try:
            #to do: thêm phần time adding file trong mongodb
            load(file)
            return {"message": 'File added!', "filename": file.filename}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing {file.filename}, {str(e)}")
        