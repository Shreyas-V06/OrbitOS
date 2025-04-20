from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from tools.todo_tools import create_todo_agent,update_todo_agent,delete_todo_agent,get_all_todos_agent
from initializers.initialize_llm import initialize_agentbrain



def initialize_agent_executor(AgentLLM):
    prompt = hub.pull("hwchase17/react")
    tools=[create_todo_agent,update_todo_agent,delete_todo_agent,get_all_todos_agent]
    agent = create_react_agent(AgentLLM,tools,prompt)
    agent_executor = AgentExecutor(agent=agent,tools=tools,verbose=True)
    return agent_executor

def invoke_agent(user_input:str):
    AgentLLM = initialize_agentbrain()
    agent_executor = initialize_agent_executor(AgentLLM)
    response = agent_executor.invoke({"input":user_input})
       
    return response['output']

