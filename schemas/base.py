from pydantic import BaseModel,Field
from datetime import datetime,timezone

class BaseClass:
    object_id:str
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))

class ToDo(BaseClass):
    def __init__(self,name,)