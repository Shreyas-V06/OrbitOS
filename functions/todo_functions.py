from fastapi import FastAPI
from pydantic import BaseModel,Field
from typing import list,Optional
from schemas.todo_schemas import TodoBase,TodoCreate,TodoDelete,TodoUpdate
from database.initialize_firebase import initialize_firestore

api=FastAPI()
db=initialize_firestore()

@api.get('/todos/{unique_id}',response_model=TodoBase)
def get_todo_by_id(unique_id:str):
    todoref=db.collection('todos')
    docs=todoref.stream()
    for doc in docs:
        if doc.unique_id==unique_id:
            return doc


