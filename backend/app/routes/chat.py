from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.schemas import ChatQuery, ChatResponse
from app.services.gemini_service import generate_ai_response, retrieve_rag_context
from app.models.models import Book

router = APIRouter(prefix="/chat", tags=["AI Librarian & Gemini RAG"])

SYSTEM_PROMPT = """You are the official AI Librarian for LPU LIBRARY — Where Knowledge Comes Alive.
You speak with professional academic warmth, friendly clarity, and rigorous factual grounding.

CORE DIRECTIVES:
1. ONLY answer based on the provided Library Context below.
2. If asked about book recommendations, suggest matching books from the context and explain their difficulty and prerequisites.
3. If asked where a book is located, provide the Floor, Section, Aisle, and Shelf exactly as listed in the context, explicitly noting '(DEMO DATA)' for shelf coordinates.
4. If the retrieved context does not contain the answer, politely state: "I could not find that verified in the current LPU Library catalog. Please consult the circulation desk or search the Explore page."
5. Never invent or hallucinate book titles, authors, or shelf coordinates not present in the catalog.
6. Provide concise, clear source citations.
"""

@router.post("", response_model=ChatResponse)
async def chat_with_librarian(chat_in: ChatQuery, db: Session = Depends(get_db)):
    query = chat_in.question
    context_str, sources = retrieve_rag_context(db, query)

    prompt_messages = [
        {"role": "system", "content": f"{SYSTEM_PROMPT}\n\nLIBRARY KNOWLEDGE CONTEXT:\n{context_str}"}
    ]

    # Append recent conversation history
    for msg in (chat_in.history or [])[-4:]:
        prompt_messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

    prompt_messages.append({"role": "user", "content": query})

    # Call AI LLM (Google Gemini)
    ai_answer, engine_name = await generate_ai_response(prompt_messages)

    if ai_answer and not ai_answer.startswith("Gemini API Error") and not ai_answer.startswith("Error"):
        return ChatResponse(
            answer=ai_answer,
            sources=sources,
            engine=engine_name or "Google Gemini RAG"
        )

    # Fallback to intelligent factual rule-engine if key is not configured or fails
    q_low = query.lower()
    books = db.query(Book).filter(Book.is_archived == False).all()
    
    # 1. Location query
    for b in books:
        if b.title.lower() in q_low or (len(q_low.split()) > 1 and any(word in b.title.lower().split() for word in q_low.split() if len(word) > 4)):
            sh = b.shelf_rel
            if sh:
                loc_desc = f"Floor {sh.section.floor.floor_number}, {sh.section.name}, Aisle {sh.aisle}, Shelf {sh.shelf_number}, Rack {sh.rack_number}, Bay {sh.bay_number}"
            else:
                loc_desc = "Floor 2, Computer Science Section, Aisle A3"
            return ChatResponse(
                answer=f"📍 **{b.title}** by {b.author} is located at **{loc_desc}** *(DEMO DATA)*.\n\n**Difficulty:** {b.difficulty} | **Subject:** {b.subject_rel.name if b.subject_rel else 'General'}\n**Prerequisites:** {', '.join(b.prerequisites) or 'None'}",
                sources=[{"title": b.title, "book_id": b.id, "type": "catalog_record"}],
                engine="RAG Local Grounding (Google Gemini Fallback)"
            )

    # 2. Prerequisites query
    if "prerequisite" in q_low or "before" in q_low:
        return ChatResponse(
            answer="📚 In our academic curriculum, we recommend starting with **Mathematics for Machine Learning** and **Data Structures** before diving into **Deep Learning** or **Artificial Intelligence: A Modern Approach**.",
            sources=[{"title": "Curriculum Matrix", "book_id": None, "type": "prerequisites"}],
            engine="RAG Local Grounding"
        )

    # 3. Subject suggestions
    matched = [b for b in books if b.subject_rel and b.subject_rel.name.lower() in q_low]
    if matched:
        items = "\n".join([f"• **{b.title}** by {b.author} ({b.difficulty})" for b in matched[:4]])
        return ChatResponse(
            answer=f"📖 Here are the top verified resources for your request:\n\n{items}\n\nYou can click on any title in the **Explore Books** page to inspect exact shelf locations or reserve a copy.",
            sources=[{"title": b.title, "book_id": b.id, "type": "catalog_record"} for b in matched[:4]],
            engine="RAG Local Grounding"
        )

    return ChatResponse(
        answer="👋 Hello! As the LPU AI Librarian, I can assist you with:\n\n• **Finding Book Locations:** e.g., *'Where is Introduction to Algorithms?'*\n• **Prerequisite Pathways:** e.g., *'What should I read before Deep Learning?'*\n• **Subject Discovery:** e.g., *'Show me AI textbooks'*",
        sources=[],
        engine="RAG Local Grounding"
    )
