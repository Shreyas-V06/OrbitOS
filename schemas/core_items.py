from pydantic import BaseModel,Field
from datetime import datetime,timezone,time
from enum import IntEnum
from typing import Optional


def end_of_today_utc():
    now = datetime.now(timezone.utc)
    return datetime.combine(now.date(), time(23, 59, 59), tzinfo=timezone.utc)

def now_utc():
    return datetime.now(timezone.utc)


class BaseClass(BaseModel):
    object_id:str
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Priority(IntEnum):
    LOW=0
    MEDIUM=1
    HIGH=2

# Request Models
class ToDoCreate(BaseModel):
    task_name:str =Field(...,min_length=1,max_length=512,description="Name of the task in todo")
    checkbox:bool =Field(False,description="Status of the task in todo")
    priority:Priority=Field(Priority.LOW, description="Priority of the todo")
    duedate: datetime = Field(default_factory=end_of_today_utc,description="Due Date of task")

class ToDoUpdate(BaseModel):
    task_name: Optional[str] = Field(None, min_length=1, max_length=512)
    checkbox: Optional[bool] = None
    priority: Optional[Priority] = None
    duedate: Optional[datetime] = None

class ProjectCreate(BaseModel):
    project_name:str =Field(...,min_length=1,max_length=512,description="Name of the project")
    checkbox:bool =Field(False,description="Status of the Project")
    priority:Priority=Field(Priority.LOW, description="Priority of the project")
    duedate: datetime = Field(default_factory=end_of_today_utc,description="Due Date of project")

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = Field(None, min_length=1, max_length=512)
    checkbox: Optional[bool] = None
    priority: Optional[Priority] = None
    duedate: Optional[datetime] = None

class ReminderCreate(BaseModel):
    reminderdate: datetime = Field(...,description="Reminder for the project")
    reminder_name:str =Field(...,min_length=1,max_length=512,description="Name of the reminder")
    context:str=Field(...,min_length=3,max_length=512,description="context of the reminder")

class ReminderUpdate(BaseModel):
    reminderdate: Optional[datetime] = None
    reminder_name: Optional[str] = Field(None, min_length=1, max_length=512)
    context: Optional[str] = Field(None, min_length=3, max_length=512)

# Response Models
class ToDo(BaseClass):
    task_name:str =Field(...,min_length=1,max_length=512,description="Name of the task in todo")
    checkbox:bool =Field(...,description="Status of the task in todo")
    priority:Priority=Field(Priority.LOW, description="Priority of the todo")
    duedate: datetime = Field(default_factory=end_of_today_utc,description="Due Date of task")

class Project(BaseClass):
    project_name:str =Field(...,min_length=1,max_length=512,description="Name of the project")
    checkbox:bool =Field(...,description="Status of the Project")
    priority:Priority=Field(Priority.LOW, description="Priority of the project")
    duedate: datetime = Field(default_factory=end_of_today_utc,description="Due Date of project")

class Reminder(BaseClass):
    reminderdate: datetime = Field(...,description="Reminder for the project")
    reminder_name:str =Field(...,min_length=1,max_length=512,description="Name of the reminder")
    context:str=Field(...,min_length=3,max_length=512,description="context of the reminder")
