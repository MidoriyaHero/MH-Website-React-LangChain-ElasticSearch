from beanie import Document, Link
from typing import List
from app.schemas.response_schema import ResponseHis
from app.models.user_model import User


class history(Document):
    user: Link[User]  # Reference to User model
    messages: List[ResponseHis] = []  # List of chat messages

    class Settings:
        name = 'history'