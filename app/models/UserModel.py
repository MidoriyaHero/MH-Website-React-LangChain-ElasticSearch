from beanie import Document, Indexed
from uuid import UUID, uuid4
from pydantic import Field, EmailStr
from datetime import datetime
from typing import Optional



class User(Document):
    user_id: UUID = Field(default_factory = uuid4)
    user_name: str
    email: Indexed(EmailStr, unique = True)
    hash_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    disable: Optional[bool] = None
    emergency_contact_email: Optional[EmailStr] = None

    def __repr__(self) -> str:
        return f'<User {self.email}>'
    
    def __str__(self) -> str:
        return self.email
    
    def __hash__(self) -> int:
        return hash(self.email)
    
    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    @classmethod
    async def by_email(self, email):
        return await self.find_one(self.email == email)
    
    class Settings:
        name = 'users'