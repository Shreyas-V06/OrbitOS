from pydantic import Field,BaseModel
from datetime import date
from typing import Optional,list

class BaseClass(BaseModel):
    unique_id:str #Unique identifier for each object

class TodoBase(BaseModel,BaseClass):
    todo_name:str=Field(...,min_length=2,max_length=30,description="Name of the todo")
    todo_checkbox:bool=Field(False,description="Status of the todo")
    todo_duedate:date=Field(...,default_factory=date.today,description="Due date of the todo")

class TodoCreate(BaseModel,TodoBase):
    pass

class TodoUpdate(BaseModel):
    todo_name:Optional[str]=Field(...,min_length=2,max_length=30,description="Name of the todo")
    todo_checkbox:Optional[bool]=Field(False,description="Status of the todo")
    todo_duedate:Optional[date]=Field(...,default_factory=date.today,description="Due date of the todo")

class TodoDelete(BaseModel,TodoBase):
    pass


