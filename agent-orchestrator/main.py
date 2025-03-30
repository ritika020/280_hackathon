# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional

# # Import agent stubs (or define inline)
# from agents.web_agent import handle_web_agent_query
# from agents.clinical_agent import handle_clinical_query
# from agents.food_agent import handle_food_query

# app = FastAPI()

# # 1) Set up CORS so requests from http://localhost:3000 (React dev server) are allowed
# origins = [
#     "http://localhost:3000",
#     # Add more if needed, e.g. "https://your-deployed-frontend.com"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 2) Define request/response models
# class QueryRequest(BaseModel):
#     prompt: str
#     agent: Optional[str] = None  # e.g. "webAgent", "clinicalAgent", "foodSecurityAgent"

# class QueryResponse(BaseModel):
#     sender: str
#     text: str

# # 3) The orchestrator endpoint
# @app.post("/query", response_model=QueryResponse)
# def query_agent(req: QueryRequest):
#     """
#     Orchestrator that routes prompt to correct agent based on req.agent or simple classification.
#     Returns a single message (ai response) as an example.
#     """
#     prompt = req.prompt
#     agent = None

#     print(prompt)

#     # Simple keyword-based classification
#     if any(word in prompt.lower() for word in ["heart", "clinical", "symptom"]):
#         agent = "clinicalAgent"
#     elif any(word in prompt.lower() for word in ["food", "nutrition", "agriculture"]):
#         agent = "foodSecurityAgent"
#     else:
#         agent = "webAgent"

#     if agent == "webAgent":
#         response_text = handle_web_agent_query(prompt)
#     elif agent == "clinicalAgent":
#         response_text = handle_clinical_query(prompt)
#     elif agent == "foodSecurityAgent":
#         response_text = handle_food_query(prompt)
#     else:
#         # If user specified something else or no agent matched
#         raise HTTPException(status_code=400, detail="Unknown agent type")

#     return QueryResponse(sender="ai", text=response_text)

from fastapi import FastAPI, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from orchestrator import handle_query
from agents.document_agent import handle_document_query
from uuid import uuid4
from db import db
from schemas.session import SessionResponse
from fastapi.responses import JSONResponse
from datetime import datetime
from fastapi.encoders import jsonable_encoder

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class QueryRequest(BaseModel):
    user_input: str
    session_id: str

## Basic scope - 3 agents - web, clinical, food   
@app.post("/query")
async def query_handler(request: QueryRequest):
    response = await handle_query(request.user_input,request.session_id)
    ##return {"response": response.content if hasattr(response, "content") else str(response)}
    return {"response":response}


## Additional - User can upload their own documents
@app.post("/document-query")
async def document_query_handler(
    file: UploadFile = File(...),
    query: str = Form(...),
    session_id: str = Form(...)
):
    response = await handle_document_query(file, query,session_id)
    return {"response": response.content if hasattr(response, "content") else str(response)}

## Create a unique session id at the first load of the page
@app.post("/create-session", response_model=SessionResponse)
async def create_session():
    session_id = str(uuid4())
    session_count = await db.sessions.count_documents({})
    session_name = f"Session {session_count + 1}"

    session_doc = {
        "session_id": session_id,
        "name": session_name,
        "messages": [],
        "created_at": datetime.utcnow()
    }

    await db.sessions.insert_one(session_doc)

    return {
        "session_id": session_id,
        "name": session_name,
        "created_at": session_doc["created_at"]
    }

## Get all the previous chats 
@app.get("/sessions")
async def get_all_sessions():
    sessions = []
    cursor = db.sessions.find({}, {"_id": 0}).sort("created_at", -1)
    async for session in cursor:
        sessions.append(session)
    json_safe = jsonable_encoder(sessions)
    return JSONResponse(content={"sessions": json_safe})


