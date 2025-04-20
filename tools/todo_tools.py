from base_functions.todo_functions import create_todo,update_todo
from langchain.agents import tool
from tools.output_parsers import output_parser_create_todo,output_parser_update_todo,extract_unique_id
from initializers.initialize_llm import initialize_parserLLM
from initializers.initialize_firestore import initialize_firestore


@tool
def create_todo_agent(todo_details:str):
    """
      Creates a new todo in Firestore.
      Use this tool whenever user asks 

    This function accepts three seperate parameters and not a single parameter.

    The parameters for this function are:
    - todo_name: name of the todo (str value)
    - todo_checkbox: whether it is completed (boolean value)
    - todo_duedate: due date in YYYY-MM-DD format (str value)

      """
    parserLLM=initialize_parserLLM()
    parameter_object=output_parser_create_todo(todo_details,parserLLM)
    return create_todo(parameter_object)
    
@tool
def get_all_todos_agent():
    
    """
    this tool returns list of all the todo lists from firestore
    Use this function whenever you want to get details of all the todolists first
    and then to search for the details of a specific todo list 
    the details you want like:

    1.unique_id
    2.todo_name
    3.todo_duedate
    4.todo_checkbox

    This tool has no parameters

    This tool returns data regarding all the todos as a list
    where in, each todo's details will be enclosed in curly braces

    Example:
    [ 
      {'unique_id': 'todo1619efd4', 'todo_checkbox': False, 'todo_duedate': '2025-10-19', 'todo_name': 'GE'}, 
      {'unique_id': 'todo2a2d876c', 'todo_checkbox': False, 'todo_duedate': '2024-02-02', 'todo_name': 'Learn Shapes'},
      {'unique_id': 'todo356aa75f', 'todo_checkbox': False, 'todo_duedate': '2024-02-09', 'todo_name': 'Learn Perspective'}, 
      {'unique_id': 'todo67068bd8', 'todo_checkbox': False, 'todo_duedate': '2025-10-19', 'todo_name': 'English'}, 
      {'unique_id': 'todo74e013e5', 'todo_checkbox': False, 'todo_duedate': '2025-10-19', 'todo_name': 'DEVC'}, 
      {'unique_id': 'todo79f8d9a2', 'todo_checkbox': False, 'todo_duedate': '2025-10-17', 'todo_name': 'Study Physics'}
    ]

    
    """
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
        return "User has created no todos at all"
    

def get_todo_by_id(unique_id:str):
    try:
        db=initialize_firestore()
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            return f"Todo with id {unique_id} not found"

        return doc.to_dict()
    except Exception as e:
        return "Error occured"



@tool
def delete_todo_agent(unique_id: str):
    """
       This function can be used to delete any todos that already exists.
       To delete a task , you need to know its unique id 
    
        If you do not know about the unique id , you can try searching for it by calling
        the get_all_todo tool

        Input format for parameter:
        Just give the unique id without anything else along with it

        i.e 
        delete_todo_agent(unique_id=todo356aa75f) is wrong
        delete_todo_agent(todo356aa75f) is right
    
    """

    try:
        todo = get_todo_by_id(unique_id)
        if not todo:
            return "No such todo exists"
        
        print(f"unique id recieved by function is {unique_id}\nand its type is {type(unique_id)}")
        db=initialize_firestore()
        db.collection("Todos").document(str(unique_id)).delete()
        return {"status": "successufully deleted", "id": unique_id}
   
    except Exception as e:
        return "Error occured"


@tool
def update_todo_agent(tododetails:str):
    """This function is used to update values of the already existing todo list
    For this to work, you must provide two parameters:
    
    1.unique id = the unique id associated with the todo you have to edit (you might need to search using get_all_todos method)

    2.updated_todo _details= must contains only the fields that you wish to edit. and do not include any additional fields 
    i.e
    if the current todo details are {todo_name=Read a book, todo_duedate = 17/10/2025 , todo_checkbox = False}
    and the requested update is to make the checkbox to true, then the parameter should be 

    {todo_checkbox=True}
    instead of 
    {todo_name=Read a book, todo_duedate = 17/10/2025 , todo_checkbox = True}

    INPUT FORMAT=
    {unique_id='todoabc123',update_todo_details={todo_name='ABCD'}}
    Always follow this input format
    
    do not even make even slight changes
    like replace 'unique_id='todoabc123'' with 'unique_id:'todoabc123'
    since regex has to be used with the output you generate
    
    """
    parserLLM=initialize_parserLLM()
    todo_object=output_parser_update_todo(tododetails,parserLLM)
    print(f"todo details passed are: {tododetails}")
    unique_id=extract_unique_id(tododetails)
    return  update_todo(unique_id,todo_object)



@tool
def time_today():
    """
    Returns the current date and time.

    Use this tool whenever the user requests something that depends on the current or relative date/time.
    Examples:
    - Creating a todo with today's date or the current timestamp.
    - Setting a deadline as "tomorrow", "next week", or similar.
    - Scheduling or logging events based on the current time.

    Always prefer this tool over guessing the time by yourself

"""
    from datetime import datetime
    now = datetime.now()
    return {
        "time": now.strftime("%H:%M:%S"),
        "date": now.strftime("%Y-%m-%d")
    }

