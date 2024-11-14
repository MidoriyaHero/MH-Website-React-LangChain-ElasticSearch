from beanie import Document, Link
from typing import Optional
from pydantic import Field
import datetime
from app.models.user_model import User


class history(Document):
    user: Link[User]  # Reference to User model
    input: Optional[str]
    answer: Optional[str]
    create_at: datetime = Field(default_factory = datetime.now)
    
    class Settings:
        name = 'history'