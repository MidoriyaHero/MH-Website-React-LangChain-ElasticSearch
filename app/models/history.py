from beanie import Document, Link
from typing import Optional
from pydantic import Field
from uuid import UUID, uuid4
import datetime
from app.models.user_model import User


class history(Document):
    session_id: UUID  # Reference to user_id in User model
    input: Optional[str]
    answer: Optional[str]
    create_at: datetime = Field(default_factory = datetime.now)
    
    class Settings:
        name = 'history'