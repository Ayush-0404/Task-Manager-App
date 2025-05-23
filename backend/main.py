from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="Task Board API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kaamkaaz-frontend.onrender.com"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    columnId: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    columnId: Optional[str] = None

class Task(TaskBase):
    id: str
    columnId: str
    createdAt: str

class Column(BaseModel):
    id: str
    title: str
    tasks: List[Task] = []

class Board(BaseModel):
    columns: List[Column]

# In-memory database
db = {
    "columns": [
        {
            "id": "column-1",
            "title": "To Do",
            "tasks": []
        },
        {
            "id": "column-2",
            "title": "In Progress",
            "tasks": []
        },
        {
            "id": "column-3",
            "title": "Done",
            "tasks": []
        }
    ],
    "tasks": {}
}

# Helper functions
def find_column(column_id: str):
    for column in db["columns"]:
        if column["id"] == column_id:
            return column
    return None

def generate_sample_data():
    # Create some sample tasks
    sample_tasks = [
        {
            "title": "Research project requirements",
            "description": "Gather all necessary information about the project scope and requirements.",
            "columnId": "column-1"
        },
        {
            "title": "Design database schema",
            "description": "Create ER diagrams and define the database structure.",
            "columnId": "column-1"
        },
        {
            "title": "Implement authentication",
            "description": "Add user login and registration functionality.",
            "columnId": "column-2"
        },
        {
            "title": "Write unit tests",
            "description": "Create comprehensive test suite for all core functionality.",
            "columnId": "column-2"
        },
        {
            "title": "Fix navigation bug",
            "description": "Address the issue with sidebar navigation in mobile view.",
            "columnId": "column-3"
        }
    ]
    
    # Add tasks to the database
    for task_data in sample_tasks:
        create_task(TaskCreate(**task_data))

# Create a task
def create_task(task: TaskCreate) -> Task:
    task_id = f"task-{str(uuid.uuid4())}"
    new_task = {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "columnId": task.columnId,
        "createdAt": datetime.now().isoformat()
    }
    
    # Add to tasks dictionary
    db["tasks"][task_id] = new_task
    
    # Add to column
    column = find_column(task.columnId)
    if column:
        column["tasks"].append(new_task)
    
    return Task(**new_task)

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Board API"}

@app.get("/board", response_model=Board)
def get_board():
    return {"columns": db["columns"]}

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in db["tasks"]:
        raise HTTPException(status_code=404, detail="Task not found")
    return db["tasks"][task_id]

@app.post("/tasks", response_model=Task)
def create_task_endpoint(task: TaskCreate):
    # Validate column exists
    column = find_column(task.columnId)
    if not column:
        raise HTTPException(status_code=400, detail="Column not found")
    
    return create_task(task)

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskUpdate):
    if task_id not in db["tasks"]:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = db["tasks"][task_id]
    
    # Handle potential column change
    old_column_id = task["columnId"]
    new_column_id = task_update.columnId or old_column_id
    
    # Update task properties
    if task_update.title is not None:
        task["title"] = task_update.title
    if task_update.description is not None:
        task["description"] = task_update.description
    if task_update.columnId is not None:
        task["columnId"] = task_update.columnId
    
    # Handle moving task between columns if needed
    if old_column_id != new_column_id:
        # Remove from old column
        old_column = find_column(old_column_id)
        if old_column:
            old_column["tasks"] = [t for t in old_column["tasks"] if t["id"] != task_id]
        
        # Add to new column
        new_column = find_column(new_column_id)
        if new_column:
            new_column["tasks"].append(task)
    
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in db["tasks"]:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Get the task to be deleted
    task = db["tasks"][task_id]
    column_id = task["columnId"]
    
    # Remove from tasks dictionary
    del db["tasks"][task_id]
    
    # Remove from column
    column = find_column(column_id)
    if column:
        column["tasks"] = [t for t in column["tasks"] if t["id"] != task_id]
    
    return {"message": "Task deleted successfully"}

# Generate sample data on startup
@app.on_event("startup")
def startup_event():
    generate_sample_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 