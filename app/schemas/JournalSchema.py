from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class JournalCreate(BaseModel):
    title: str = Field(..., title="Title")
    description: str = Field(..., title="Description")
    status: Optional[bool] = False

class JournalUpdate(BaseModel):
    title: Optional[str] = Field(None, title="Title")
    description: Optional[str] = Field(None, title="Description")
    status: Optional[bool] = False
    # Add evaluation fields
    sentiment_analysis: Optional[str] = None
    emotions: Optional[List[str]] = []
    themes: Optional[List[str]] = []
    is_evaluated: Optional[bool] = False
    last_evaluated_at: Optional[datetime] = None

class JournalOut(BaseModel):
    journal_id: UUID
    status: Optional[bool] = False
    title: str = Field(..., title="Title")
    description: str = Field(..., title="Description")
    create_at: Optional[datetime]
    update_at: Optional[datetime]
    # Evaluation fields
    is_evaluated: Optional[bool] = False
    sentiment_analysis: Optional[str] = None
    emotions: Optional[List[str]] = []
    themes: Optional[List[str]] = []
    last_evaluated_at: Optional[datetime] = None
    