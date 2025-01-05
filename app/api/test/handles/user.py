from pydantic import EmailStr
from fastapi import APIRouter, HTTPException, Depends

from app.schemas.UserSchema import UserAuth, UserOut
from app.services.UserService import UserService
from app.api.test.dependency.UserDependency import get_current_user
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

@user_router.patch('/update-emergency', response_model=UserOut)
async def update_emergency_contact(
    emergency_contact: EmailStr,
    current_user: User = Depends(get_current_user)
):
    try:
        updated_user = await UserService.update_user(
            str(current_user.user_id), 
            {"emergency_contact_email": emergency_contact}
        )
        return updated_user
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to update emergency contact: {str(e)}"
        )