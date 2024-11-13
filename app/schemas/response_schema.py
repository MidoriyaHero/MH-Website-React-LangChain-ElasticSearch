from pydantic import BaseModel
from typing import Optional, List, Any


class Response(BaseModel):
    input: Optional[str]
    context: List[Any]
    answer: Optional[str]
