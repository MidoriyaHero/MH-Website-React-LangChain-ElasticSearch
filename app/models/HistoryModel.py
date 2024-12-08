from beanie import Document, Link
from typing import Optional
from pydantic import Field
from uuid import UUID, uuid4
from datetime import datetime

from app.models.UserModel import User

class Session(Document):
    session_id: UUID = Field(default_factory = uuid4, unique = True)
    session_name: Optional[str]
    owner: Link[User]
    create_at: datetime = Field(default_factory = datetime.now)

    class Settings:
        name = 'Session'

class HistoryMessage(Document):
    SessionId: UUID
    role: Optional[str]
    content: Optional[str]
    create_at: datetime = Field(default_factory = datetime.now)
    session: Link[Session]

    class Settings:
        name = 'History'