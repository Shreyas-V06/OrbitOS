from functions.todo_functions import api

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("functions.todo_functions:api", host="0.0.0.0", port=8000, reload=True) 