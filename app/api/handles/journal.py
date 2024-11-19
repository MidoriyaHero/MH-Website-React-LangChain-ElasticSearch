from fastapi import APIRouter, Depends
from uuid import UUID
from typing import List

from app.models.user_model import User
from app.api.dependency.user_dependency import get_current_user
from app.schemas.journal_schema import JournalOut, JournalCreate, JournalUpdate
from app.services.journal_service import JournalService
from app.models.journal_model import DailyJournal

journal_router = APIRouter()

@journal_router.get('/', response_model = List[JournalOut])
async def list(current_user: User = Depends(get_current_user)):
    return await JournalService.list_journals(current_user)

@journal_router.post('/create', response_model = DailyJournal)
async def create(data: JournalCreate, current_user: User = Depends(get_current_user)):
    return await JournalService.create( current_user, data)

@journal_router.get('/{journal_id}', response_model=JournalOut)
async def get_journal_by_id(journal_id: UUID, current_user: User = Depends(get_current_user)):
    return await JournalService.retrieve(current_user, journal_id)

@journal_router.put('/{journal_id}', response_model = JournalOut)
async def update(journal_id: UUID, data: JournalUpdate, current_user: User = Depends(get_current_user)):
    return await JournalService.update_journal(current_user, journal_id, data)

@journal_router.delete('{journal_id}')
async def delete(journal_id: UUID, current_user: User = Depends(get_current_user)):
    await JournalService.delete_journal(current_user,journal_id)
    return {"Message":"Successfully deleted!"}