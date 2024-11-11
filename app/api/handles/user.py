from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserAuth, UserOut
from app.services.user_service import UserService
import pymongo
from app.api.dependency.user_dependency import get_current_user
from app.models.user_model import User


user_router = APIRouter()
@user_router.post('/create-users', response_model=UserOut)
async def create(data : UserAuth):
    try:
        return await UserService.create_user(data)
    except:
        raise HTTPException(  
            status_code= 400, 
            detail ="UserName or Email is already exists!")

@user_router.get('/me', response_model = UserOut)
async def get_user(current_user: User = Depends(get_current_user)):
    return current_user