from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatQuery(BaseModel):
    question: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]] = []
    engine: str = "Google Gemini RAG"
