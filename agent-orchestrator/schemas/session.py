from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    prompt: str
    answer: str

class SessionCreate(BaseModel):
    session_id: str = Field(..., description="Unique ID for the session")
    name: str = Field(..., description="Display name for the session")

class Session(BaseModel):
    session_id: str
    name: str
    messages: List[Message] = []
    created_at: Optional[datetime] = None

class MessageAppend(BaseModel):
    session_id: str
    prompt: str
    answer: str

class SessionResponse(BaseModel):
    session_id: str
    name: str
    created_at: datetime

