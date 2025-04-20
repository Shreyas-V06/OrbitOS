import os
import google.generativeai as genai #type:ignore
from langchain_google_genai import ChatGoogleGenerativeAI

"""
Initializes two LLM models
1.ParserLLM (gemini-1.5-flash): used for output parsing and RAG --> cheaper model with not much reasoning skills
2.AgentBrain (gemini-2.0-flash): used by agent to make decisions --> smarter model but lower rate limits

"""
def initialize_parserLLM():
    GeminiApiKey=os.getenv('GOOGLE_API_KEY')
    genai.configure(api_key=GeminiApiKey)
    GeminiLLM = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    return GeminiLLM

def initialize_agentbrain():
    GeminiApiKey=os.getenv('GOOGLE_API_KEY')
    genai.configure(api_key=GeminiApiKey)
    GeminiLLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    return GeminiLLM

