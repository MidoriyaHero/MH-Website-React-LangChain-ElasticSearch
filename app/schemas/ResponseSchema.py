from pydantic import BaseModel, Field


class Message(BaseModel):
    role: str = Field(..., title = "Role")
    content: str = Field(..., title= "Content")
