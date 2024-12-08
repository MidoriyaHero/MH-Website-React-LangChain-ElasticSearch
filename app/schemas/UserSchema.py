from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID


class UserAuth(BaseModel):
    email: EmailStr = Field(..., description = "User Email")
    username : str = Field(..., max_length = 50, description = "UserName")
    password : str = Field(..., min_length = 5, description ='UserPassword')

class UserOut(BaseModel):
    user_id: UUID 
    user_name: str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str] 
    disable: Optional[bool]