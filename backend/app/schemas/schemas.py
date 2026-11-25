from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    student_id: Optional[str] = None
    role: Optional[str] = "STUDENT" # default STUDENT

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

# --- User Schemas ---
class UserOut(BaseModel):
    id: int
    student_id: Optional[str]
    email: str
    full_name: str
    avatar_url: Optional[str]
    phone: Optional[str]
    department: Optional[str]
    is_active: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None

class UserStatusUpdate(BaseModel):
    is_active: bool

# --- Subject Schemas ---
class SubjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    color: Optional[str]
    book_count: int = 0

    class Config:
        from_attributes = True

# --- Location Schemas ---
class ShelfOut(BaseModel):
    id: int
    aisle: str
    shelf_number: str
    rack_number: str
    bay_number: str
    map_x: float
    map_y: float
    section_id: int
    section_name: Optional[str] = None
    floor_number: Optional[int] = None
    building_name: Optional[str] = None

    class Config:
        from_attributes = True

class ShelfCreate(BaseModel):
    section_id: int
    aisle: str
    shelf_number: str
    rack_number: str
    bay_number: str
    map_x: float = 0.0
    map_y: float = 0.0

class SectionCreate(BaseModel):
    floor_id: int
    name: str
    code: str
    color: str = "#DC2626"
    map_x: float = 20.0
    map_y: float = 20.0
    map_w: float = 180.0
    map_h: float = 120.0

class FloorCreate(BaseModel):
    building_id: int
    floor_number: int
    name: str

class BuildingCreate(BaseModel):
    name: str
    description: Optional[str] = None

# --- Book Schemas ---
class BookBase(BaseModel):
    isbn: str
    title: str
    author: str
    publisher: Optional[str] = None
    year: Optional[int] = None
    pages: Optional[int] = None
    subject_id: int
    difficulty: str = "Intermediate"
    cover_url: Optional[str] = None
    description: Optional[str] = None
    topics: List[str] = []
    prerequisites: List[str] = []
    total_copies: int = 5
    available_copies: int = 5
    shelf_id: Optional[int] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    year: Optional[int] = None
    pages: Optional[int] = None
    subject_id: Optional[int] = None
    difficulty: Optional[str] = None
    cover_url: Optional[str] = None
    description: Optional[str] = None
    topics: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    shelf_id: Optional[int] = None

class BookOut(BookBase):
    id: int
    subject_name: Optional[str] = None
    is_archived: bool
    location_details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# --- Borrow & Reservation Schemas ---
class BorrowCreate(BaseModel):
    user_id: int
    book_id: int
    due_days: int = 14
    notes: Optional[str] = None

class BorrowOut(BaseModel):
    id: int
    user_id: int
    student_id: Optional[str]
    student_name: str
    student_email: str
    book_id: int
    book_title: str
    book_cover: Optional[str]
    issue_date: datetime
    due_date: datetime
    return_date: Optional[datetime]
    status: str
    fine_amount: float
    notes: Optional[str]

    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    book_id: int

class ReservationOut(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_email: str
    book_id: int
    book_title: str
    request_date: datetime
    status: str
    admin_notes: Optional[str]

    class Config:
        from_attributes = True

class ReservationStatusUpdate(BaseModel):
    status: str # APPROVED, REJECTED, FULFILLED
    admin_notes: Optional[str] = None

# --- Chat & RAG Schemas ---
class ChatQuery(BaseModel):
    question: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]] = []
    engine: str = "Google Gemini RAG"
