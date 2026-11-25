import httpx
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.models.models import RAGChunk, Book

async def query_gemini_llm(messages: List[Dict[str, str]]) -> str:
    """
    Calls Google Gemini REST API using the configured GEMINI_API_KEY.
    """
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        return ""

    # Map model name
    model = settings.GEMINI_MODEL or "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Extract system instruction & contents
    system_instruction = None
    contents = []

    for msg in messages:
        role = msg.get("role", "user")
        text = msg.get("content", "")
        if role == "system":
            system_instruction = {"parts": [{"text": text}]}
        elif role == "assistant":
            contents.append({"role": "model", "parts": [{"text": text}]})
        else:
            contents.append({"role": "user", "parts": [{"text": text}]})

    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024
        }
    }
    if system_instruction:
        payload["systemInstruction"] = system_instruction

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
                return "Received response from Gemini without text content."
            else:
                return f"Gemini API Error ({resp.status_code}): {resp.text}"
        except Exception as e:
            return f"Error communicating with Gemini service: {str(e)}"

async def query_grok_llm(messages: List[Dict[str, str]]) -> str:
    """
    Calls the official xAI Grok API endpoint.
    """
    if not settings.XAI_API_KEY or settings.XAI_API_KEY.strip() == "":
        return ""

    headers = {
        "Authorization": f"Bearer {settings.XAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": settings.GROK_MODEL,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 1024
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(
                f"{settings.GROK_API_BASE}/chat/completions",
                json=payload,
                headers=headers
            )
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            else:
                return f"Grok API Response Error ({resp.status_code}): {resp.text}"
        except Exception as e:
            return f"Error communicating with Grok service: {str(e)}"

async def generate_ai_response(messages: List[Dict[str, str]]) -> Tuple[str, str]:
    """
    Routes to the configured LLM provider (Gemini or Grok).
    Returns (answer, engine_name).
    """
    provider = (settings.LLM_PROVIDER or "gemini").lower()

    if provider == "gemini" and settings.GEMINI_API_KEY:
        ans = await query_gemini_llm(messages)
        if ans and not ans.startswith("Gemini API Error") and not ans.startswith("Error"):
            return ans, f"Google {settings.GEMINI_MODEL} + Vector RAG"
        elif ans:
            # Return error message for diagnosis if invalid key or error
            return ans, "Gemini Error"

    if settings.XAI_API_KEY:
        ans = await query_grok_llm(messages)
        if ans and not ans.startswith("Grok API Response Error") and not ans.startswith("Error"):
            return ans, f"xAI {settings.GROK_MODEL} + Vector RAG"

    return "", ""

def retrieve_rag_context(db, query: str) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Performs retrieval over local RAG knowledge chunks and books metadata.
    Returns assembled context and source citations.
    """
    terms = [t.lower() for t in query.replace("?", "").replace(",", "").split() if len(t) > 2]
    all_chunks = db.query(RAGChunk).all()
    all_books = db.query(Book).filter(Book.is_archived == False).all()

    matched_chunks = []
    sources = []

    for chunk in all_chunks:
        content_lower = chunk.content.lower()
        score = sum(1 for term in terms if term in content_lower)
        if score > 0:
            matched_chunks.append((score, chunk))

    matched_chunks.sort(key=lambda x: x[0], reverse=True)
    top_chunks = matched_chunks[:5]

    context_lines = []
    for score, chunk in top_chunks:
        context_lines.append(f"[{chunk.title}]\n{chunk.content}\n")
        sources.append({
            "title": chunk.title,
            "book_id": chunk.book_id,
            "type": chunk.chunk_type
        })

    # If no chunk matches directly, provide book titles catalog
    if not context_lines:
        titles_sample = ", ".join([b.title for b in all_books[:8]])
        context_lines.append(f"Library Catalogue Sample: {titles_sample}")

    context_str = "\n".join(context_lines)
    return context_str, sources
