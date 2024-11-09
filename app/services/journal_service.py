from typing import List 
from app.models.user_model  import User
from app.models.journal_model import DailyJournal
from app.schemas.journal_schema import JournalCreate, JournalUpdate
from uuid import UUID


class TodoService:
    @staticmethod 
    async def list_journals(user: User) -> List[DailyJournal]:
        todos = await DailyJournal.find(DailyJournal.owner.id == user.id).to_list()
        return todos
    
    @staticmethod
    async def create( user: User, data: JournalCreate) -> DailyJournal:
        todo = DailyJournal(**data.dict(), owner = user)
        return await todo.insert()
    
    @staticmethod
    async def retrieve( user: User, todi_id: UUID):
        todo = DailyJournal.find_one(DailyJournal.todo_id == todi_id, DailyJournal.owner.id == user.id)
        return todo
    
    @staticmethod
    async def update_todo( user: User, todo_id: UUID, data: JournalUpdate) -> DailyJournal:
        todo = await TodoService.retrieve(user, todo_id)
        await todo.update({"$set": data.dict(exclude_unset = True)})
        await todo.save()
        return todo
    
    @staticmethod
    async def delete_todo( user: User, todo_id: UUID) -> DailyJournal:
        todo = await TodoService.retrieve(user, todo_id)
        if todo:
            await todo.delete()
        return None