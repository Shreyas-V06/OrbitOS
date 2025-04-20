from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent_brain.agent_executor import invoke_agent
from schemas.todo_schemas import TodoCreate,TodoBase,TodoUpdate
from initializers.initialize_firestore import initialize_firestore
from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class TodoCreate(BaseModel):
    todo_name: str
    todo_checkbox: bool = False
    todo_duedate: Optional[datetime] = None

@app.post("/api/agent/chat")
async def chat_with_agent(message: ChatMessage):
    print("Received message:", message.message)  # Debug log
    try:
        response = invoke_agent(message.message)
        print("Agent response:", response)  # Debug log
        return {"response": response}
    except Exception as e:
        print("Error:", str(e)) 
        return {"error": str(e)}
    

@app.get('/todos',response_model=List[TodoBase])
async def get_todos():
    try:
        db=initialize_firestore()
        todoref = db.collection('Todos')
        docs = todoref.stream()
        
        todos = []
        for doc in docs:
            data = doc.to_dict()
            todos.append(TodoBase(**data))
        
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/api/todos")
async def create_todo(todo: TodoCreate):
    try:
        # Use the agent to create the todo
        response = invoke_agent(f"Create a todo with name: {todo.todo_name}, checkbox: {todo.todo_checkbox}, and due date: {todo.todo_duedate}")
        return {"message": response}
    except Exception as e:
        return {"error": str(e)}
    



@app.get('/todos/{unique_id}',response_model=TodoBase)
async def get_todo_by_id(unique_id:str):
    try:
        db=initialize_firestore()
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")

        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.put('/todos/{unique_id}',response_model=dict)
def update_todo(unique_id:str, todo_data: TodoUpdate):
    try:
        db=initialize_firestore()
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


@app.delete('/todos/{unique_id}', response_model=dict)
def delete_todo(unique_id: str):
    try:
        db=initialize_firestore()
        todo = get_todo_by_id(unique_id)
        if not todo:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")
            
        db.collection("Todos").document(unique_id).delete()
        return {"status": "success", "id": unique_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
