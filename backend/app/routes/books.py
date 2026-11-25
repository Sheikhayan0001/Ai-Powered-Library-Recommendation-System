from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import Book, Subject, LibraryShelf, LibrarySection, LibraryFloor, RAGChunk
from app.schemas.schemas import BookOut, BookCreate, BookUpdate
from app.core.security import require_admin

router = APIRouter(prefix="/books", tags=["Books"])

def format_book_out(b: Book) -> dict:
    loc_details = None
    if b.shelf_rel:
        sh = b.shelf_rel
        loc_details = {
            "floor": sh.section.floor.floor_number if sh.section and sh.section.floor else 1,
            "section": sh.section.name if sh.section else "General",
            "section_code": sh.section.code if sh.section else "GEN",
            "aisle": sh.aisle,
            "shelf": sh.shelf_number,
            "rack": sh.rack_number,
            "bay": sh.bay_number,
            "map_x": sh.map_x,
            "map_y": sh.map_y
        }
    return {
        "id": b.id,
        "isbn": b.isbn,
        "title": b.title,
        "author": b.author,
        "publisher": b.publisher,
        "year": b.year,
        "pages": b.pages,
        "subject_id": b.subject_id,
        "subject_name": b.subject_rel.name if b.subject_rel else "General",
        "difficulty": b.difficulty,
        "cover_url": b.cover_url,
        "description": b.description,
        "topics": b.topics or [],
        "prerequisites": b.prerequisites or [],
        "total_copies": b.total_copies,
        "available_copies": b.available_copies,
        "shelf_id": b.shelf_id,
        "is_archived": b.is_archived,
        "location_details": loc_details
    }

@router.get("", response_model=List[dict])
def get_books(
    q: Optional[str] = None,
    subject: Optional[str] = None,
    difficulty: Optional[str] = None,
    include_archived: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Book)
    if not include_archived:
        query = query.filter(Book.is_archived == False)
    if subject and subject != "All":
        query = query.join(Subject).filter(Subject.name == subject)
    if difficulty and difficulty != "All":
        query = query.filter(Book.difficulty == difficulty)
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (Book.title.ilike(search_filter)) |
            (Book.author.ilike(search_filter)) |
            (Book.isbn.ilike(search_filter))
        )
    books = query.all()
    return [format_book_out(b) for b in books]

@router.get("/{book_id}", response_model=dict)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return format_book_out(book)

@router.post("", response_model=dict)
def create_book(book_in: BookCreate, db: Session = Depends(get_db), current_admin = Depends(require_admin)):
    existing = db.query(Book).filter(Book.isbn == book_in.isbn).first()
    if existing:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")

    new_book = Book(
        isbn=book_in.isbn,
        title=book_in.title,
        author=book_in.author,
        publisher=book_in.publisher,
        year=book_in.year,
        pages=book_in.pages,
        subject_id=book_in.subject_id,
        difficulty=book_in.difficulty,
        cover_url=book_in.cover_url,
        description=book_in.description,
        topics=book_in.topics,
        prerequisites=book_in.prerequisites,
        total_copies=book_in.total_copies,
        available_copies=book_in.available_copies,
        shelf_id=book_in.shelf_id
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    # Sync RAG Chunk automatically
    loc_text = "Main Stacks"
    if new_book.shelf_rel:
        sh = new_book.shelf_rel
        loc_text = f"Floor {sh.section.floor.floor_number}, Section {sh.section.name}, Aisle {sh.aisle}, Shelf {sh.shelf_number}"
    rag_content = f"Book: {new_book.title}\nAuthor: {new_book.author}\nDescription: {new_book.description}\nDifficulty: {new_book.difficulty}\nLocation: {loc_text}"
    chunk = RAGChunk(
        book_id=new_book.id,
        chunk_type="book_metadata",
        title=f"Metadata - {new_book.title}",
        content=rag_content,
        metadata_json={"isbn": new_book.isbn}
    )
    db.add(chunk)
    db.commit()

    return format_book_out(new_book)

@router.put("/{book_id}", response_model=dict)
def update_book(book_id: int, book_in: BookUpdate, db: Session = Depends(get_db), current_admin = Depends(require_admin)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data = book_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(book, field, val)
    db.commit()
    db.refresh(book)

    # Update RAG Chunk
    chunk = db.query(RAGChunk).filter_by(book_id=book.id).first()
    if chunk:
        loc_text = "Main Stacks"
        if book.shelf_rel:
            sh = book.shelf_rel
            loc_text = f"Floor {sh.section.floor.floor_number}, Section {sh.section.name}, Aisle {sh.aisle}, Shelf {sh.shelf_number}"
        chunk.content = f"Book: {book.title}\nAuthor: {book.author}\nDescription: {book.description}\nDifficulty: {book.difficulty}\nLocation: {loc_text}"
        db.commit()

    return format_book_out(book)

@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), current_admin = Depends(require_admin)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check active borrows
    has_active = any(t.status == "ISSUED" for t in book.borrow_transactions)
    if has_active:
        raise HTTPException(status_code=400, detail="Cannot delete book with active borrowing transactions. Use archival instead.")

    book.is_archived = True
    db.commit()
    return {"message": f"Book '{book.title}' safely archived."}
