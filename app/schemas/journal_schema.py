from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class JournalCreate(BaseModel):
    title: str = Field(..., title = "Title")
    description: str = Field(..., title= "Description")
    status: Optional[bool] = False

class JournalUpdate(BaseModel):
    title: Optional[str] = Field(..., title = "Title")
    description: Optional[str] = Field(..., title= "Description")
    status: Optional[bool] = False

class JournalOut(BaseModel):
    journal_id: UUID
    status: bool
    title: str
    description: str
    create_at: datetime
    update_at: datetime
    