from typing import List, Optional
from schemas.core_items import ToDo, Project, Reminder, Priority
import datetime
from database.initialize_firebase import initialize_firebase

# Get the db instance
db = initialize_firebase()

# Collection names
TODOS_COLLECTION = "todos"
PROJECTS_COLLECTION = "projects"
REMINDERS_COLLECTION = "reminders"


# --- ToDo CRUD ---

def create_todo_db(todo: ToDo) -> ToDo:
    """Creates a new todo document in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    todo_ref = db.collection(TODOS_COLLECTION).document(todo.object_id)
    todo_dict = todo.model_dump()
    todo_ref.set(todo_dict)
    return todo

def get_todo_db(todo_id: str) -> Optional[ToDo]:
    """Retrieves a todo from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    todo_ref = db.collection(TODOS_COLLECTION).document(todo_id)
    doc = todo_ref.get()
    if doc.exists:
        return ToDo(**doc.to_dict())
    return None

def get_all_todos_db() -> List[ToDo]:
    """Retrieves all todos from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    todos = []
    for doc in db.collection(TODOS_COLLECTION).stream():
        todos.append(ToDo(**doc.to_dict()))
    return todos

def update_todo_db(todo_id: str, updates: dict) -> Optional[ToDo]:
    """Updates a todo in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    todo_ref = db.collection(TODOS_COLLECTION).document(todo_id)
    if not todo_ref.get().exists:
        return None
    
    updates['updated_at'] = datetime.datetime.utcnow()
    todo_ref.update(updates)
    return get_todo_db(todo_id)

def delete_todo_db(todo_id: str) -> bool:
    """Deletes a todo from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    todo_ref = db.collection(TODOS_COLLECTION).document(todo_id)
    if not todo_ref.get().exists:
        return False
    todo_ref.delete()
    return True

# --- Project CRUD ---

def create_project_db(project: Project) -> Project:
    """Creates a new project document in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    project_ref = db.collection(PROJECTS_COLLECTION).document(project.object_id)
    project_dict = project.model_dump()
    project_ref.set(project_dict)
    return project

def get_project_db(project_id: str) -> Optional[Project]:
    """Retrieves a project from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    project_ref = db.collection(PROJECTS_COLLECTION).document(project_id)
    doc = project_ref.get()
    if doc.exists:
        return Project(**doc.to_dict())
    return None

def get_all_projects_db() -> List[Project]:
    """Retrieves all projects from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    projects = []
    for doc in db.collection(PROJECTS_COLLECTION).stream():
        projects.append(Project(**doc.to_dict()))
    return projects

def update_project_db(project_id: str, updates: dict) -> Optional[Project]:
    """Updates a project in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    project_ref = db.collection(PROJECTS_COLLECTION).document(project_id)
    if not project_ref.get().exists:
        return None
    
    updates['updated_at'] = datetime.datetime.utcnow()
    project_ref.update(updates)
    return get_project_db(project_id)

def delete_project_db(project_id: str) -> bool:
    """Deletes a project from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    project_ref = db.collection(PROJECTS_COLLECTION).document(project_id)
    if not project_ref.get().exists:
        return False
    project_ref.delete()
    return True

# --- Reminder CRUD ---

def create_reminder_db(reminder: Reminder) -> Reminder:
    """Creates a new reminder document in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    reminder_ref = db.collection(REMINDERS_COLLECTION).document(reminder.object_id)
    reminder_dict = reminder.model_dump()
    reminder_ref.set(reminder_dict)
    return reminder

def get_reminder_db(reminder_id: str) -> Optional[Reminder]:
    """Retrieves a reminder from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    reminder_ref = db.collection(REMINDERS_COLLECTION).document(reminder_id)
    doc = reminder_ref.get()
    if doc.exists:
        return Reminder(**doc.to_dict())
    return None

def get_all_reminders_db() -> List[Reminder]:
    """Retrieves all reminders from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    reminders = []
    for doc in db.collection(REMINDERS_COLLECTION).stream():
        reminders.append(Reminder(**doc.to_dict()))
    return reminders

def update_reminder_db(reminder_id: str, updates: dict) -> Optional[Reminder]:
    """Updates a reminder in Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    reminder_ref = db.collection(REMINDERS_COLLECTION).document(reminder_id)
    if not reminder_ref.get().exists:
        return None
    
    updates['updated_at'] = datetime.datetime.utcnow()
    reminder_ref.update(updates)
    return get_reminder_db(reminder_id)

def delete_reminder_db(reminder_id: str) -> bool:
    """Deletes a reminder from Firestore."""
    if not db: raise ValueError("Firestore client 'db' not initialized.")
    reminder_ref = db.collection(REMINDERS_COLLECTION).document(reminder_id)
    if not reminder_ref.get().exists:
        return False
    reminder_ref.delete()
    return True

