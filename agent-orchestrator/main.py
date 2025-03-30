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

from fastapi import FastAPI, Request
from pydantic import BaseModel
from orchestrator import handle_query

app = FastAPI()

class QueryRequest(BaseModel):
    user_input: str

@app.post("/query")
async def query_handler(request: QueryRequest):
    response = await handle_query(request.user_input)
    return {"response": response}