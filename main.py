from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent_brain.agent_executor import invoke_agent
from base_functions.todo_functions import create_todo, get_all_todos
from schemas.todo_schemas import TodoCreate
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
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
        print("Error:", str(e))  # Debug log
        return {"error": str(e)}

@app.get("/api/todos")
async def get_todos():
    try:
        # Use the agent to get all todos
        response = invoke_agent("Get all todos")
        return {"todos": response}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/todos")
async def create_todo(todo: TodoCreate):
    try:
        # Use the agent to create the todo
        response = invoke_agent(f"Create a todo with name: {todo.todo_name}, checkbox: {todo.todo_checkbox}, and due date: {todo.todo_duedate}")
        return {"message": response}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 