from fastapi import APIRouter, HTTPException, UploadFile
from app.utils.load_doc import load

router_add_doc = APIRouter()

@router_add_doc.post('/file/AddDocument')
async def add_document(file: UploadFile):
    try:
        #to do: thêm phần time adding file trong mongodb
        load(file)
        return {"message": 'File added!', "filename": file.filename}
    except Exception:
        raise HTTPException(status_code = 400, detail = "Invalid Documents")