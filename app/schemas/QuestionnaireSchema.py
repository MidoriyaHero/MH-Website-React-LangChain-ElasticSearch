from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List, ClassVar

class GAD7Questions(BaseModel):
    questions: ClassVar[List[str]] = [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it's hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid as if something awful might happen"
    ]

class QuestionnaireResponse(BaseModel):
    responses: List[int]

class QuestionnaireResult(BaseModel):
    response_id: UUID
    questionnaire_type: str
    total_score: int
    severity: str
    timestamp: datetime
    responses: List[int]