from fastapi import HTTPException 
from schemas.todo_schemas import TodoBase,TodoCreate,TodoUpdate
from initializers.initialize_firestore import initialize_firestore
from initializers.initialize_llm import initialize_parserLLM
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
import uuid


db=initialize_firestore()

"""
These are various helper functions , these are mainly being used inside agent tools

"""

def get_todo_by_id(unique_id:str):
    try:
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")

        return doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

def get_all_todos():
    try:
        todoref = db.collection('Todos')
        docs = todoref.stream()
        
        todos = []
        for doc in docs:
            data = doc.to_dict()
            todos.append(TodoBase(**data))
        
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def create_todo(todo_data: TodoCreate):
    try:
        unique_id = f"todo{uuid.uuid4().hex[:8]}" 
        todo_dict = {
            "todo_name": todo_data.todo_name,
            "todo_checkbox": todo_data.todo_checkbox,
            "todo_duedate": todo_data.todo_duedate.isoformat(),
            "unique_id": unique_id,
        }
        db.collection("Todos").document(unique_id).set(todo_dict)
        todo_name= todo_dict['todo_name']
        todo_date=todo_dict['todo_duedate']
        
        return {"status": "successfully created todo", "id": unique_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



def update_todo(unique_id:str, todo_data: TodoUpdate):
    try:
        doc_ref = db.collection("Todos").document(unique_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")

        existing_data = doc.to_dict()
        update_data = {}

        if todo_data.todo_name is not None:
            update_data["todo_name"] = todo_data.todo_name
        if todo_data.todo_checkbox is not None:
            update_data["todo_checkbox"] = todo_data.todo_checkbox
        if todo_data.todo_duedate is not None:
            update_data["todo_duedate"] = todo_data.todo_duedate.isoformat()

        if update_data:
            doc_ref.update(update_data)
            return {"status": "successfully updated todo", "id": unique_id, "updated_fields": list(update_data.keys())}
        else:
            return {"status": "success", "id": unique_id, "message": "No fields to update"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



def delete_todo(unique_id: str):
    try:
        todo = get_todo_by_id(unique_id)
        if not todo:
            raise HTTPException(status_code=404, detail=f"Todo with id {unique_id} not found")
            
        db.collection("Todos").document(unique_id).delete()
        return {"status": "success", "id": unique_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def query_file_base(query:str,file_path):
    loader=PyPDFLoader(file_path)
    docs=loader.load()
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=100,chunk_overlap=30)
    chunks=text_splitter.split_documents(docs)
    gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    VectorDB = FAISS.from_documents(chunks, gemini_embeddings)
    prompt= ChatPromptTemplate.from_template("""
Answer the following question based on the context mentioned below:
                                          
<context>
{context}
</context>
                                          
Question: {input}""")
    LLM=initialize_parserLLM()
    document_chain=create_stuff_documents_chain(LLM,prompt)
    retriever=VectorDB.as_retriever()
    retrieval_chain=create_retrieval_chain(retriever,document_chain)
    response = retrieval_chain.invoke({"input": query})
    return response['answer']



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



    
  

    