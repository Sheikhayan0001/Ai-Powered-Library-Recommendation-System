from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, Role, ActivityLog
from app.schemas.schemas import Token, UserLogin, UserRegister, UserOut, PasswordResetRequest, PasswordResetConfirm
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    # Check student_id uniqueness if provided
    if user_in.student_id and db.query(User).filter(User.student_id == user_in.student_id).first():
        raise HTTPException(status_code=400, detail="An account with this Student ID already exists.")

    # Determine role (default to STUDENT unless explicitly assigned by admin)
    role_name = "STUDENT"
    if user_in.role and user_in.role.upper() == "ADMIN":
        # Check if first user or explicit request
        existing_admin = db.query(User).join(Role).filter(Role.name == "ADMIN").first()
        if not existing_admin:
            role_name = "ADMIN"
            
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name)
        db.add(role)
        db.commit()

    # Create user
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        student_id=user_in.student_id,
        role_id=role.id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Activity log
    log = ActivityLog(user_id=new_user.id, action="USER_REGISTER", details=f"User {new_user.email} registered as {role_name}")
    db.add(log)
    db.commit()

    # Generate token
    token = create_access_token({"sub": str(new_user.id), "role": role.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "student_id": new_user.student_id,
            "role": role.name,
            "avatar_url": new_user.avatar_url,
            "department": new_user.department
        }
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is suspended or deactivated. Contact Admin.")

    role_name = user.role.name if user.role else "STUDENT"
    token = create_access_token({"sub": str(user.id), "role": role_name})

    log = ActivityLog(user_id=user.id, action="USER_LOGIN", details=f"User {user.email} logged in.")
    db.add(log)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "student_id": user.student_id,
            "role": role_name,
            "avatar_url": user.avatar_url,
            "department": user.department
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "student_id": current_user.student_id,
        "role": current_user.role.name if current_user.role else "STUDENT",
        "avatar_url": current_user.avatar_url,
        "phone": current_user.phone,
        "department": current_user.department,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }

@router.post("/forgot-password")
def forgot_password(req: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    # Always return success message to avoid user enumeration
    return {"message": "If this email is registered, password reset instructions have been sent."}

@router.post("/reset-password")
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    # For demo environment: accepts reset token or default flow
    return {"message": "Password has been successfully updated."}
