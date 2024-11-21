#todo add a shema for history chat services
from pydantic import BaseModel, Field
from datetime import datetime 
from typing import List

class Message(BaseModel):
    role: str = Field(..., title = "Role")
    content: str = Field(..., title = "Content")
    create_at: datetime = Field(default_factory = datetime.now)

class History_chat(BaseModel):
    history: List[Message]