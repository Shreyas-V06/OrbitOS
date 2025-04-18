from fastapi import FastAPI, HTTPException #type:ignore
from pydantic import BaseModel,Field
from typing import List,Optional
from schemas.todo_schemas import TodoBase,TodoCreate,TodoDelete,TodoUpdate
from initializers.initialize_firestore import initialize_firestore
import uuid

api=FastAPI()
db=initialize_firestore()

@api.get('/todos/{unique_id}',response_model=TodoBase)
def get_todo_by_id(unique_id:str):
    try:
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")

        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@api.get('/todos',response_model=list[TodoBase])
def get_all_todos():
    try:
        todoref = db.collection('Todos')
        docs = todoref.stream()
        
        todos = []
        for doc in docs:
            data = doc.to_dict()
            todos.append(TodoBase(**data))
        
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api.post('/todos',response_model=TodoBase)
def create_todo(todo_data: TodoCreate):
    try:
        unique_id = f"todo{uuid.uuid4().hex[:8]}" 
        todo_dict = {
            "todo_name": todo_data.todo_name,
            "todo_checkbox": todo_data.todo_checkbox,
            "todo_duedate": todo_data.todo_duedate.isoformat(),
            "unique_id": unique_id,
        }
        db.collection("Todos").document(unique_id).set(todo_dict)
        todo_name= todo_dict['todo_name']
        todo_date=todo_dict['todo_duedate']
        
        return {"status": "successfully created todo", "id": unique_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api.put('/todos/{unique_id}',response_model=dict)
def update_todo(unique_id:str, todo_data: TodoUpdate):
    try:
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")

        existing_data = doc.to_dict()
        update_data = {}

        if todo_data.todo_name is not None:
            update_data["todo_name"] = todo_data.todo_name
        if todo_data.todo_checkbox is not None:
            update_data["todo_checkbox"] = todo_data.todo_checkbox
        if todo_data.todo_duedate is not None:
            update_data["todo_duedate"] = todo_data.todo_duedate.isoformat()

        if update_data:
            doc_ref.update(update_data)
            return {"status": "successfully updated todo", "id": unique_id, "updated_fields": list(update_data.keys())}
        else:
            return {"status": "success", "id": unique_id, "message": "No fields to update"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api.delete('/todos/{unique_id}', response_model=dict)
def delete_todo(unique_id: str):
    try:
        todo = get_todo_by_id(unique_id)
        if not todo:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")
            
        db.collection("Todos").document(unique_id).delete()
        return {"status": "success", "id": unique_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


    