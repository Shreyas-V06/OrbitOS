from fastapi import APIRouter, HTTPException #type:ignore
from typing import List
from uuid import uuid4

from schemas.core_items import (
    ToDo, Project, Reminder,
    ToDoCreate, ToDoUpdate,
    ProjectCreate, ProjectUpdate,
    ReminderCreate, ReminderUpdate
)


from database.helper_functions import (
    create_todo_db, get_todo_db, get_all_todos_db, update_todo_db, delete_todo_db,
    create_project_db, get_project_db, get_all_projects_db, update_project_db, delete_project_db,
    create_reminder_db, get_reminder_db, get_all_reminders_db, update_reminder_db, delete_reminder_db
)


router = APIRouter(prefix="/items", tags=["items"])

# --- ToDo Endpoints ---
@router.post("/todos", response_model=ToDo)
async def create_todo(todo_data: ToDoCreate):
    todo = ToDo(
        object_id=f"todo_{uuid4().hex[:8]}",
        task_name=todo_data.task_name,
        checkbox=todo_data.checkbox,
        priority=todo_data.priority,
        duedate=todo_data.duedate
    )
    return create_todo_db(todo)

@router.get("/todos", response_model=List[ToDo])
async def get_todos():
    return get_all_todos_db()

@router.get("/todos/{todo_id}", response_model=ToDo)
async def get_todo(todo_id: str):
    todo = get_todo_db(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/todos/{todo_id}", response_model=ToDo)
async def update_todo(todo_id: str, todo_data: ToDoUpdate):
    updates = todo_data.model_dump(exclude_unset=True)
    todo = update_todo_db(todo_id, updates)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str):
    if not delete_todo_db(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

# --- Project Endpoints ---
@router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate):
    project = Project(
        object_id=f"proj_{uuid4().hex[:8]}",
        project_name=project_data.project_name,
        checkbox=project_data.checkbox,
        priority=project_data.priority,
        duedate=project_data.duedate
    )
    return create_project_db(project)

@router.get("/projects", response_model=List[Project])
async def get_projects():
    return get_all_projects_db()

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = get_project_db(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_data: ProjectUpdate):
    updates = project_data.model_dump(exclude_unset=True)
    project = update_project_db(project_id, updates)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    if not delete_project_db(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# --- Reminder Endpoints ---
@router.post("/reminders", response_model=Reminder)
async def create_reminder(reminder_data: ReminderCreate):
    reminder = Reminder(
        object_id=f"rem_{uuid4().hex[:8]}",
        reminder_name=reminder_data.reminder_name,
        reminderdate=reminder_data.reminderdate,
        context=reminder_data.context
    )
    return create_reminder_db(reminder)

@router.get("/reminders", response_model=List[Reminder])
async def get_reminders():
    return get_all_reminders_db()

@router.get("/reminders/{reminder_id}", response_model=Reminder)
async def get_reminder(reminder_id: str):
    reminder = get_reminder_db(reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder

@router.put("/reminders/{reminder_id}", response_model=Reminder)
async def update_reminder(reminder_id: str, reminder_data: ReminderUpdate):
    updates = reminder_data.model_dump(exclude_unset=True)
    reminder = update_reminder_db(reminder_id, updates)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder

@router.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str):
    if not delete_reminder_db(reminder_id):
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"message": "Reminder deleted successfully"}

