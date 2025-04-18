from langchain.prompts.chat import HumanMessagePromptTemplate,ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from schemas.todo_schemas import TodoCreate,TodoUpdate
import re

def output_parser_create_todo(details:str,ParserLLM):
    parser=PydanticOutputParser(pydantic_object=TodoCreate)
    human_prompt=HumanMessagePromptTemplate.from_template("{request}/n{format_instructions}")
    chat_prompt=ChatPromptTemplate.from_messages([human_prompt])

    request_base="""You are an AI productivity assistant, your job is to create python objects using the following details\n\n"""
    request_message=request_base+details

    request=chat_prompt.format_prompt(
        request=request_message,
        format_instructions=parser.get_format_instructions()
    ).to_messages()

    results=ParserLLM(request)
    result_values=parser.parse(results.content)

    return result_values

def output_parser_update_todo(details:str,ParserLLM):
    parser=PydanticOutputParser(pydantic_object=TodoUpdate)
    human_prompt=HumanMessagePromptTemplate.from_template("{request}/n{format_instructions}")
    chat_prompt=ChatPromptTemplate.from_messages([human_prompt])

    request_base = """
You are an AI productivity assistant.  
Your job is to extract only the updated todo fields from the given input string.

### Instructions:
- You will be given a string in the format:  
  `unique_id=<some_id>, updated_todo_details={<field1=value1, field2=value2>}`
- IGNORE the unique_id completely.
- Only extract the contents of `updated_todo_details` and convert them into a dictionary matching the `TodoUpdate` model — excluding the unique_id field.

### Example:

**Input string:**
unique_id=todo123abc, updated_todo_details={todo_name=Do homework, todo_checkbox=True}

**Output:**
{
  "todo_name": "Do homework",
  "todo_checkbox": true
}

**Another example:**

**Input string:**
unique_id=todo456xyz, updated_todo_details={todo_duedate=2025-05-01}

**Output:**
{
  "todo_duedate": "2025-05-01"
}

Now parse the following input:\n
"""

    request_message=request_base+details

    request=chat_prompt.format_prompt(
        request=request_message,
        format_instructions=parser.get_format_instructions()
    ).to_messages()

    results=ParserLLM(request)
    result_values=parser.parse(results.content)

    return result_values

def extract_unique_id(input_string: str):
    # Regular expression to match the unique_id pattern
    match = re.search(r"unique_id='([a-zA-Z0-9]+)'", input_string)
    
    # If a match is found, return the unique_id, else return None
    if match:
        return match.group(1)
    else:
        return None
