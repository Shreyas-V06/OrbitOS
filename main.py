from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from agent_brain.agent_executor import invoke_agent
from schemas.todo_schemas import TodoCreate,TodoBase,TodoUpdate
from initializers.initialize_firestore import initialize_firestore
from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime
import uuid
import os
import shutil


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatMessage(BaseModel):
    message: str
    filePath: Optional[str] = None

"""
Below mentioned are various API Endpoints which are being used

Endpoints for agent tab:

1. POST /upload --> this endpoint is to upload file , used for RAG based task creation
2. POST /api/agent/chat --> this endpoint is used to invoke agent 

Endpoints for todo tab:

1.POST /todos --> create todo
2.GET /todos --> get all todos
3.PUT /todos/{unique_id} --> update a todo
4.DELETE /todos/{unique_id} --> delete a todo

"""


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filePath": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agent/chat")
async def chat_with_agent(message: ChatMessage):
    print("Received message:", message.message) 
    print("File path:", message.filePath) 
    try:
        response = invoke_agent(message.message)
        print("Agent response:", response)  
        return {"response": response}
    except Exception as e:
        print("Error:", str(e)) 
        return {"error": str(e)}
    

@app.get('/todos',response_model=List[dict])
async def get_todos():
    try:
        db=initialize_firestore()
        todoref = db.collection('Todos')
        docs = todoref.stream()
        
        todos = []
        for doc in docs:
            data = doc.to_dict()
            todos.append(data)
        
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.post("/todos")
async def create_todo(todo_data: TodoCreate):
    try:
        db=initialize_firestore()
        unique_id = f"todo{uuid.uuid4().hex[:8]}" 
        todo_dict = {
            "todo_name": todo_data.todo_name,
            "todo_checkbox": todo_data.todo_checkbox,  
            "todo_duedate": todo_data.todo_duedate.isoformat(),
            "unique_id": unique_id,
        }
        db.collection("Todos").document(unique_id).set(todo_dict)
        
        return {"status": "successfully created todo", "id": unique_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



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
async def update_todo(unique_id:str, todo_data: TodoUpdate):
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
    import uvicorn #type:ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)
