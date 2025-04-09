from fastapi import FastAPI #type:ignore
from fastapi.middleware.cors import CORSMiddleware #type:ignore
from database.initialize_firebase import initialize_firebase
db = initialize_firebase()

# Import routers
from routers.items import router as items_router

app = FastAPI(
    title="OrbitOS",
    description="Agentic Productivity",
    version="4.2.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(items_router)

@app.get("/")
async def root():
    return {"message": "Welcome to OrbitOS API"}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000) #type:ignore