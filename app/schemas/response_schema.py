from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class Response(BaseModel):
    input: Optional[str]
    context: List[Any]
    answer: Optional[str]
    create_at: datetime = Field(default_factory = datetime.now)


class ResponseHis(BaseModel):
    input: Optional[str]
    answer: Optional[str]
    create_at: datetime = Field(default_factory = datetime.now)