from app.schemas.UserSchema import UserAuth
from app.models.UserModel import User
from app.core.security import get_password, verify_password

from fastapi import HTTPException

class UserService:
    @staticmethod 
    async def create_user(user: UserAuth):
        user_in = User(
            user_name = user.username,
            email = user.email,
            hash_password = get_password(user.password)
        )
        await user_in.save()
        return user_in
    
    @staticmethod
    async def get_user_by_email(email: str):
        user = await User.find_one(User.email == email)
        return user
    
    @staticmethod
    async def get_user_by_id(UserId: str):
        user = await User.find_one(User.user_id == UserId)
        return user
    
    @staticmethod
    async def authenticate(email: str, password: str):
        user = await UserService.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code= 400, detail= "Incorrect email address")
        if not verify_password(password, user.hash_password):
            raise HTTPException(status_code= 400, detail= "Incorrect password")
        return user
    
    @staticmethod
    async def update_user(user_id: str, update_data: dict):
        user = await UserService.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update only provided fields
        for field, value in update_data.items():
            if field == "password":
                setattr(user, "hash_password", get_password(value))
            else:
                setattr(user, field, value)
        
        await user.save()
        return user
    