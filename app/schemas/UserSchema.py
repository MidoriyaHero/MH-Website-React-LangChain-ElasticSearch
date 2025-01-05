from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID


class UserAuth(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    emergency_contact_email: Optional[EmailStr] = None

class UserOut(BaseModel):
    user_id: UUID
    user_name: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    emergency_contact_email: Optional[EmailStr] = None