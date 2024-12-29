from fastapi import APIRouter, Depends, HTTPException, Security
from typing import List
from uuid import UUID

from app.models.UserModel import User
from app.api.v1.dependency.UserDependency import get_current_user
from app.services.QuestionnaireService import QuestionnaireService
from app.schemas.QuestionnaireSchema import (
    GAD7Questions,
    QuestionnaireResponse,
    QuestionnaireResult
)

# Add security_schemes to the router
questionnaire_router = APIRouter(
    prefix="/questionnaire",
    tags=["questionnaire"],
    dependencies=[Security(get_current_user)]  # This makes all endpoints require authentication
)

@questionnaire_router.get("/gad7/questions")
async def get_gad7_questions(current_user: User = Depends(get_current_user)):
    """Get GAD-7 questionnaire questions"""
    return GAD7Questions().questions

@questionnaire_router.post("/gad7/submit", response_model=QuestionnaireResult)
async def submit_gad7(
    responses: QuestionnaireResponse,
    current_user: User = Depends(get_current_user)
):
    """Submit GAD-7 questionnaire responses"""
    try:
        result = await QuestionnaireService.submit_gad7(current_user, responses.responses)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@questionnaire_router.get("/history")
async def get_questionnaire_history(
    questionnaire_type: str = None,
    current_user: User = Depends(get_current_user)
):
    """Get user's questionnaire history"""
    return await QuestionnaireService.get_user_questionnaire_history(
        current_user,
        questionnaire_type
    )

@questionnaire_router.get("/response/{response_id}")
async def get_questionnaire_response(
    response_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """Get specific questionnaire response"""
    response = await QuestionnaireService.get_questionnaire_by_id(
        current_user,
        response_id
    )
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    return response 