from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from app.database.connection import get_db
from app.models.models import BorrowTransaction, Book, User, Reservation, ActivityLog
from app.schemas.schemas import BorrowCreate, BorrowOut, ReservationCreate, ReservationOut, ReservationStatusUpdate
from app.core.security import get_current_user, require_admin

router = APIRouter(tags=["Circulation & Borrowing"])

def format_borrow_out(b: BorrowTransaction) -> dict:
    return {
        "id": b.id,
        "user_id": b.user_id,
        "student_id": b.user.student_id if b.user else None,
        "student_name": b.user.full_name if b.user else "Unknown",
        "student_email": b.user.email if b.user else "Unknown",
        "book_id": b.book_id,
        "book_title": b.book.title if b.book else "Unknown",
        "book_cover": b.book.cover_url if b.book else None,
        "issue_date": b.issue_date,
        "due_date": b.due_date,
        "return_date": b.return_date,
        "status": b.status,
        "fine_amount": b.fine_amount or 0.0,
        "notes": b.notes
    }

# --- Student endpoints ---
@router.get("/borrowing/my-books", response_model=List[dict])
def get_my_borrowed_books(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    txs = db.query(BorrowTransaction).filter(BorrowTransaction.user_id == current_user.id).all()
    return [format_borrow_out(t) for t in txs]

@router.post("/reservations", response_model=dict)
def create_reservation(res_in: ReservationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == res_in.book_id, Book.is_archived == False).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not available for reservation")

    # Check existing pending reservation
    existing = db.query(Reservation).filter(
        Reservation.user_id == current_user.id,
        Reservation.book_id == book.id,
        Reservation.status == "PENDING"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending reservation for this book.")

    res = Reservation(user_id=current_user.id, book_id=book.id, status="PENDING")
    db.add(res)
    db.commit()
    db.refresh(res)

    log = ActivityLog(user_id=current_user.id, action="BOOK_RESERVED", details=f"Reserved '{book.title}'")
    db.add(log)
    db.commit()

    return {
        "id": res.id,
        "book_id": res.book_id,
        "book_title": book.title,
        "status": res.status,
        "request_date": res.request_date
    }

@router.get("/reservations/my-reservations", response_model=List[dict])
def get_my_reservations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    res_list = db.query(Reservation).filter(Reservation.user_id == current_user.id).all()
    return [{
        "id": r.id,
        "book_id": r.book_id,
        "book_title": r.book.title if r.book else "Unknown",
        "book_cover": r.book.cover_url if r.book else None,
        "status": r.status,
        "request_date": r.request_date,
        "admin_notes": r.admin_notes
    } for r in res_list]

# --- Admin endpoints ---
@router.get("/admin/borrowing/transactions", response_model=List[dict])
def get_all_transactions(status: str = None, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    q = db.query(BorrowTransaction)
    if status:
        q = q.filter(BorrowTransaction.status == status)
    txs = q.order_by(BorrowTransaction.issue_date.desc()).all()
    return [format_borrow_out(t) for t in txs]

@router.post("/admin/borrowing/issue", response_model=dict)
def issue_book(issue_in: BorrowCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    book = db.query(Book).filter(Book.id == issue_in.book_id, Book.is_archived == False).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available for issue")

    user = db.query(User).filter(User.id == issue_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    due_date = datetime.utcnow() + timedelta(days=issue_in.due_days)
    tx = BorrowTransaction(
        user_id=user.id,
        book_id=book.id,
        issue_date=datetime.utcnow(),
        due_date=due_date,
        status="ISSUED",
        issued_by=admin.full_name,
        notes=issue_in.notes
    )
    book.available_copies -= 1
    db.add(tx)
    db.commit()
    db.refresh(tx)

    log = ActivityLog(user_id=admin.id, action="BOOK_ISSUED", details=f"Issued '{book.title}' to {user.full_name} ({user.student_id})")
    db.add(log)
    db.commit()

    return format_borrow_out(tx)

@router.post("/admin/borrowing/return/{tx_id}", response_model=dict)
def return_book(tx_id: int, notes: str = None, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    tx = db.query(BorrowTransaction).filter(BorrowTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if tx.status == "RETURNED":
        raise HTTPException(status_code=400, detail="Book already marked as returned")

    tx.status = "RETURNED"
    tx.return_date = datetime.utcnow()
    if notes:
        tx.notes = f"{tx.notes or ''}\nReturn Note: {notes}"

    # Calculate overdue fine ($1 per day overdue)
    if tx.return_date > tx.due_date:
        days_overdue = (tx.return_date - tx.due_date).days
        tx.fine_amount = max(0.0, float(days_overdue * 2.0))

    if tx.book:
        tx.book.available_copies = min(tx.book.total_copies, tx.book.available_copies + 1)

    db.commit()
    db.refresh(tx)

    log = ActivityLog(user_id=admin.id, action="BOOK_RETURNED", details=f"Returned transaction #{tx.id} for book '{tx.book.title if tx.book else ''}'")
    db.add(log)
    db.commit()

    return format_borrow_out(tx)

@router.get("/admin/reservations", response_model=List[dict])
def get_all_reservations(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    res = db.query(Reservation).order_by(Reservation.request_date.desc()).all()
    return [{
        "id": r.id,
        "user_id": r.user_id,
        "student_name": r.user.full_name if r.user else "Unknown",
        "student_id": r.user.student_id if r.user else "Unknown",
        "student_email": r.user.email if r.user else "Unknown",
        "book_id": r.book_id,
        "book_title": r.book.title if r.book else "Unknown",
        "status": r.status,
        "request_date": r.request_date,
        "admin_notes": r.admin_notes
    } for r in res]

@router.patch("/admin/reservations/{res_id}", response_model=dict)
def update_reservation(res_id: int, res_update: ReservationStatusUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    r = db.query(Reservation).filter(Reservation.id == res_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reservation not found")

    r.status = res_update.status
    if res_update.admin_notes:
        r.admin_notes = res_update.admin_notes
    db.commit()
    return {"message": f"Reservation status updated to {r.status}"}
