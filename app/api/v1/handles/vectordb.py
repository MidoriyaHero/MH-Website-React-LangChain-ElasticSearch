from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List

from app.services.VectorStoreService import VectorStoreService

vectordb_router = APIRouter()
vector_service = VectorStoreService()

@vectordb_router.post('/upload/files')
async def upload_files(
    files: List[UploadFile] = File(...)
):
    """
    Upload multiple files (PDF or JSON) at once
    Returns a list of processing results for each file
    """
    results = []
    
    for file in files:
        try:
            vector_service.load(file)
            results.append({
                "filename": file.filename,
                "status": "success",
                "type": "json",
                "message": f"JSON processed successfully"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "status": "error",
                "message": str(e)
            })
    
    # If all files failed, raise an HTTP exception
    if all(result["status"] == "error" for result in results):
        raise HTTPException(
            status_code=500,
            detail={
                "message": "All files failed to process",
                "results": results
            }
        )
    
    return {
        "status": "completed",
        "total_files": len(files),
        "successful": len([r for r in results if r["status"] == "success"]),
        "failed": len([r for r in results if r["status"] == "error"]),
        "results": results
    }

@vectordb_router.get('/search')
async def search(
    query: str
):
    """Search documents by query and optionally filter by key"""
    try:
        results = vector_service.search(query=query)
        return {
            "status": "success",
            "results": results
        }
    except Exception:
        return "KHong có dữ liệu liên quan"

# Example usage:
# Upload multiple files:
# curl -X POST "http://localhost:8000/vectordb/upload/files" \
#   -H "accept: application/json" \
#   -H "Content-Type: multipart/form-data" \
#   -F "files=@document1.pdf" \
#   -F "files=@document2.pdf" \
#   -F "files=@data.json"
#
# Search:
# curl -X GET "http://localhost:8000/vectordb/search?query=anxiety&key=coping_strategies&k=5"