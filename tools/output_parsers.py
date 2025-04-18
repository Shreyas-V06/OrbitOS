from langchain.prompts.chat import HumanMessagePromptTemplate,ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from schemas.todo_schemas import TodoCreate

def outputparser_create_todo(details:str,ParserLLM):
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

