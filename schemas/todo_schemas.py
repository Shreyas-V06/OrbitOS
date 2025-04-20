from pydantic import Field,BaseModel
from datetime import date
from typing import Optional

"""
 Simple class defintions
 being used for Pydantic Output parsing and schema validator
 
"""
class TodoBase(BaseModel):
    todo_name:str=Field(...,min_length=2,max_length=30,description="Name of the todo")
    todo_checkbox:bool=Field(False,description="Status of the todo")
    todo_duedate:date=Field(...,default_factory=date.today,description="Due date of the todo")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    todo_name:Optional[str]=Field(None,min_length=2,max_length=30,description="Name of the todo")
    todo_checkbox:Optional[bool]=Field(None,description="Status of the todo")
    todo_duedate:Optional[date]=Field(None,description="Due date of the todo")

class TodoDelete(TodoBase):
    pass


