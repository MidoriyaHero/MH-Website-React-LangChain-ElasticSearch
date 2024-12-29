from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from beanie import Document, Link
from pydantic import Field

from app.models.UserModel import User

class QuestionnaireResponse(Document):
    response_id: UUID = Field(default_factory=uuid4)
    questionnaire_type: str  # e.g., "GAD-7", "PHQ-9"
    responses: List[int]  # Individual question scores
    total_score: int
    severity: str  # Interpretation of the score
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    owner: Link[User]

    class Settings:
        name = "questionnaire_responses" 