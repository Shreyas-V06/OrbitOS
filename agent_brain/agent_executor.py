from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from tools.todo_tools import create_todo_agent,update_todo_agent,delete_todo_agent,get_all_todos_agent,time_today,query_File
from initializers.initialize_llm import initialize_agentbrain

"""These methods are used to create the agent object"""

def initialize_agent_executor(AgentLLM):
    prompt = hub.pull("hwchase17/react")
    #below are the tools that agent has access to
    tools=[create_todo_agent,update_todo_agent,delete_todo_agent,get_all_todos_agent,time_today,query_File]
    agent = create_react_agent(AgentLLM,tools,prompt)
    agent_executor = AgentExecutor(agent=agent,tools=tools,verbose=True)
    return agent_executor

def invoke_agent(user_input:str):
    AgentLLM = initialize_agentbrain()
    agent_executor = initialize_agent_executor(AgentLLM)
    #You cannot do anything with the unique_id, unique id is just irrelavant hence the below line
    response = agent_executor.invoke({"input":user_input+"\nNever disclose the unique_id of the todo list to the user, as its against guidelines"})
       
    return response['output']

