from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, ActivityLog
from app.schemas.schemas import UserUpdate
from app.core.security import get_current_user
import shutil
import os

router = APIRouter(prefix="/users", tags=["Student Profile"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "avatars")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/profile")
def get_student_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Calculate statistics
    total_borrowed = len(current_user.borrow_transactions)
    currently_issued = sum(1 for t in current_user.borrow_transactions if t.status == "ISSUED")
    pending_reservations = sum(1 for r in current_user.reservations if r.status == "PENDING")
    total_fines = sum(t.fine_amount for t in current_user.borrow_transactions if t.fine_amount)

    return {
        "id": current_user.id,
        "student_id": current_user.student_id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "phone": current_user.phone,
        "department": current_user.department,
        "role": current_user.role.name if current_user.role else "STUDENT",
        "created_at": current_user.created_at,
        "stats": {
            "total_borrowed": total_borrowed,
            "currently_issued": currently_issued,
            "pending_reservations": pending_reservations,
            "total_fines": total_fines
        }
    }

@router.put("/profile")
def update_student_profile(profile_in: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.phone is not None:
        current_user.phone = profile_in.phone
    if profile_in.department is not None:
        current_user.department = profile_in.department
    if profile_in.avatar_url is not None:
        current_user.avatar_url = profile_in.avatar_url

    db.commit()
    db.refresh(current_user)

    log = ActivityLog(user_id=current_user.id, action="PROFILE_UPDATE", details="Updated personal profile details")
    db.add(log)
    db.commit()

    return {"message": "Profile updated successfully"}

@router.post("/avatar")
def upload_avatar(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Validate mime
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files (JPEG, PNG, WebP) are allowed")

    ext = os.path.splitext(file.filename)[1] or ".png"
    filename = f"user_{current_user.id}_{int(os.times().system)}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/uploads/avatars/{filename}"
    current_user.avatar_url = avatar_url
    db.commit()

    return {"avatar_url": avatar_url, "message": "Avatar uploaded successfully"}
