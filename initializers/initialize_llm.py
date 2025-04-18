import os
import google.generativeai as genai #type:ignore
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

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

