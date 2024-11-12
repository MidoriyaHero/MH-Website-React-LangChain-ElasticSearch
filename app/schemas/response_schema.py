from pydantic import BaseModel
from typing import Optional, List
from langchain_core.documents import Document


class Response(BaseModel):
    input: Optional[str]
    context: List[Document]
    answer: Optional[str]
