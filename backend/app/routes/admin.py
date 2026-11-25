from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import User, Book, BorrowTransaction, Reservation, ActivityLog, Role
from app.schemas.schemas import UserOut, UserUpdate, UserStatusUpdate
from app.core.security import get_current_user, require_admin

router = APIRouter(prefix="/admin", tags=["Admin Management"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_users = db.query(User).count()
    total_books = db.query(Book).filter(Book.is_archived == False).count()
    
    # Calculate available vs total copies
    books = db.query(Book).filter(Book.is_archived == False).all()
    total_copies = sum(b.total_copies for b in books)
    available_copies = sum(b.available_copies for b in books)

    issued_books = db.query(BorrowTransaction).filter(BorrowTransaction.status == "ISSUED").count()
    overdue_books = db.query(BorrowTransaction).filter(BorrowTransaction.status == "OVERDUE").count()
    pending_reservations = db.query(Reservation).filter(Reservation.status == "PENDING").count()
    total_transactions = db.query(BorrowTransaction).count()

    recent_activities = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(10).all()

    return {
        "total_users": total_users,
        "total_books": total_books,
        "total_copies": total_copies,
        "available_copies": available_copies,
        "issued_books": issued_books,
        "overdue_books": overdue_books,
        "pending_reservations": pending_reservations,
        "total_transactions": total_transactions,
        "recent_activities": [{
            "id": a.id,
            "action": a.action,
            "details": a.details,
            "timestamp": a.timestamp
        } for a in recent_activities]
    }

@router.get("/users", response_model=List[dict])
def get_all_users(q: str = None, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    query = db.query(User)
    if q:
        search = f"%{q}%"
        query = query.filter((User.full_name.ilike(search)) | (User.email.ilike(search)) | (User.student_id.ilike(search)))
    users = query.all()
    
    result = []
    for u in users:
        active_borrows = db.query(BorrowTransaction).filter(BorrowTransaction.user_id == u.id, BorrowTransaction.status == "ISSUED").count()
        result.append({
            "id": u.id,
            "student_id": u.student_id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role.name if u.role else "STUDENT",
            "department": u.department,
            "is_active": u.is_active,
            "created_at": u.created_at,
            "active_borrows_count": active_borrows
        })
    return result

@router.patch("/users/{user_id}/status")
def toggle_user_status(user_id: int, status_in: UserStatusUpdate, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot alter your own admin status")
    
    user.is_active = status_in.is_active
    db.commit()

    log = ActivityLog(user_id=admin.id, action="USER_STATUS_CHANGE", details=f"Changed user {user.email} status to is_active={user.is_active}")
    db.add(log)
    db.commit()

    return {"message": f"User status updated to {'Active' if user.is_active else 'Suspended'}"}
