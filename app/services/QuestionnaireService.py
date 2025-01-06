from datetime import datetime
from typing import List
from uuid import UUID

from app.models.QuestionnaireModel import QuestionnaireResponse
from app.models.UserModel import User

class QuestionnaireService:
    @staticmethod
    def calculate_gad7_severity(total_score: int) -> str:
        if total_score <= 4:
            return "Không có rối loạn lo âu"
        elif total_score <= 9:
            return "Lo âu mức độ nhẹ"
        elif total_score <= 14:
            return "Lo âu mức độ trung bình"
        else:
            return "Lo âu mức độ nặng"

    @staticmethod
    async def submit_gad7(user: User, responses: List[int]) -> QuestionnaireResponse:
        if len(responses) != 7 or not all(0 <= r <= 3 for r in responses):
            raise ValueError("Invalid GAD-7 responses")

        total_score = sum(responses)
        severity = QuestionnaireService.calculate_gad7_severity(total_score)

        response = QuestionnaireResponse(
            questionnaire_type="GAD7",
            responses=responses,
            total_score=total_score,
            severity=severity,
            owner=user
        )
        await response.insert()
        return response

    @staticmethod
    async def get_user_questionnaire_history(
        user: User,
        questionnaire_type: str = None
    ) -> List[QuestionnaireResponse]:
        query = QuestionnaireResponse.find(QuestionnaireResponse.owner.id == user.id)
        if questionnaire_type:
            query = query.find(QuestionnaireResponse.questionnaire_type == questionnaire_type)
        return await query.sort(-QuestionnaireResponse.timestamp).to_list()

    @staticmethod
    async def get_questionnaire_by_id(
        user: User,
        response_id: UUID
    ) -> QuestionnaireResponse:
        return await QuestionnaireResponse.find_one(
            QuestionnaireResponse.response_id == response_id,
            QuestionnaireResponse.owner.id == user.id
        )

    @staticmethod
    def calculate_phq9_severity(total_score: int) -> str:
        if total_score <= 4:
            return "Không có trầm cảm"
        elif total_score <= 9:
            return "Trầm cảm mức tối thiểu"
        elif total_score <= 14:
            return "Trầm cảm mức nhẹ"
        elif total_score <= 19:
            return "Trầm cảm mức trung bình"
        else:
            return "Trầm cảm mức nặng"

    @staticmethod
    async def submit_phq9(user: User, responses: List[int]) -> QuestionnaireResponse:
        if len(responses) != 9 or not all(0 <= r <= 3 for r in responses):
            raise ValueError("Invalid PHQ-9 responses")

        total_score = sum(responses)
        
        response = QuestionnaireResponse(
            owner=user,
            questionnaire_type="PHQ9",
            responses=responses,
            total_score=total_score,
            severity=QuestionnaireService.calculate_phq9_severity(total_score),
            timestamp=datetime.now()
        )
        await response.insert()
        return response 

    @staticmethod
    async def delete_questionnaire_response(
        user: User,
        response_id: UUID
    ) -> bool:
        """Delete a questionnaire response"""
        result = await QuestionnaireResponse.find_one(
            QuestionnaireResponse.response_id == response_id,
            QuestionnaireResponse.owner.id == user.id
        )
        if not result:
            return False
        
        await result.delete()
        return True 