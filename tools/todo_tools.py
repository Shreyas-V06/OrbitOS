from base_functions.todo_functions import create_todo
from langchain.agents import tool
from output_parsers import outputparser_create_todo
from initializers.initialize_llm import initialize_parserLLM

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
    parameter_object=outputparser_create_todo(todo_details,parserLLM)
    return create_todo(parameter_object)
    
