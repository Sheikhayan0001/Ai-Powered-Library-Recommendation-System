import httpx
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.models.models import RAGChunk, Book

# Ordered fallback list of models supported by the Google API
FALLBACK_MODELS = [
    settings.GEMINI_MODEL or "gemini-flash-lite-latest",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-pro-latest"
]

async def query_gemini_llm(messages: List[Dict[str, str]]) -> str:
    """
    Calls Google Gemini REST API using the configured GEMINI_API_KEY.
    Includes model fallback if a model experiences temporary high demand.
    """
    api_key = settings.GEMINI_API_KEY.strip()
    if not api_key:
        return ""

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

    # Attempt with available models
    models_to_try = list(dict.fromkeys(FALLBACK_MODELS)) # deduplicate preserving order

    async with httpx.AsyncClient(timeout=45.0) as client:
        last_error = ""
        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            try:
                resp = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                elif resp.status_code in [404, 429, 503]:
                    # Temporary overload or deprecated model name, try next candidate
                    last_error = f"Gemini ({model}) {resp.status_code}: {resp.text}"
                    continue
                else:
                    return f"Gemini API Error ({resp.status_code}): {resp.text}"
            except Exception as e:
                last_error = str(e)
                continue

        return f"Error communicating with Gemini service: {last_error}"

async def generate_ai_response(messages: List[Dict[str, str]]) -> Tuple[str, str]:
    """
    Generates AI response using Google Gemini API.
    Returns (answer, engine_name).
    """
    if settings.GEMINI_API_KEY:
        ans = await query_gemini_llm(messages)
        if ans and not ans.startswith("Gemini API Error") and not ans.startswith("Error"):
            return ans, "Google Gemini + Vector RAG"
        elif ans:
            return ans, "Gemini Error"

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

    if not context_lines:
        titles_sample = ", ".join([b.title for b in all_books[:8]])
        context_lines.append(f"Library Catalogue Sample: {titles_sample}")

    context_str = "\n".join(context_lines)
    return context_str, sources
