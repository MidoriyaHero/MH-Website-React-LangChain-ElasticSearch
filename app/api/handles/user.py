from fastapi import APIRouter, HTTPException, Depends

from app.schemas.UserSchema import UserAuth, UserOut
from app.services.UserService import UserService
from app.api.dependency.UserDependency import get_current_user
from app.models.UserModel import User


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