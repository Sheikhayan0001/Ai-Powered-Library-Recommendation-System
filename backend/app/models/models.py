import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False) # "ADMIN", "STUDENT"

    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True, nullable=True) # e.g. "LPU12345"
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    role = relationship("Role", back_populates="users")
    borrow_transactions = relationship("BorrowTransaction", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")
    selected_books = relationship("UserSelectedBook", back_populates="user")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="📚")
    color = Column(String(50), default="#DC2626")

    books = relationship("Book", back_populates="subject_rel")

class LibraryBuilding(Base):
    __tablename__ = "library_buildings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. "Main Academic Library"
    description = Column(Text, nullable=True)

    floors = relationship("LibraryFloor", back_populates="building", cascade="all, delete-orphan")

class LibraryFloor(Base):
    __tablename__ = "library_floors"
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("library_buildings.id"), nullable=False)
    floor_number = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False) # e.g. "First Floor - Tech Wing"
    map_svg = Column(Text, nullable=True) # SVG representation or layout JSON

    building = relationship("LibraryBuilding", back_populates="floors")
    sections = relationship("LibrarySection", back_populates="floor", cascade="all, delete-orphan")

class LibrarySection(Base):
    __tablename__ = "library_sections"
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("library_floors.id"), nullable=False)
    name = Column(String(100), nullable=False) # e.g. "Computer Science & Engineering"
    code = Column(String(50), nullable=False) # "CS"
    color = Column(String(50), default="#DC2626")
    map_x = Column(Float, default=20.0)
    map_y = Column(Float, default=20.0)
    map_w = Column(Float, default=180.0)
    map_h = Column(Float, default=120.0)

    floor = relationship("LibraryFloor", back_populates="sections")
    shelves = relationship("LibraryShelf", back_populates="section", cascade="all, delete-orphan")

class LibraryShelf(Base):
    __tablename__ = "library_shelves"
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("library_sections.id"), nullable=False)
    aisle = Column(String(50), nullable=False) # "A3"
    shelf_number = Column(String(50), nullable=False) # "S05"
    rack_number = Column(String(50), nullable=False) # "R02"
    bay_number = Column(String(50), nullable=False) # "B04"
    map_x = Column(Float, default=0.0)
    map_y = Column(Float, default=0.0)

    section = relationship("LibrarySection", back_populates="shelves")
    books = relationship("Book", back_populates="shelf_rel")

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), index=True, nullable=False)
    author = Column(String(255), index=True, nullable=False)
    publisher = Column(String(255), nullable=True)
    year = Column(Integer, nullable=True)
    pages = Column(Integer, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    difficulty = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced
    cover_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    topics = Column(JSON, default=list) # List of strings
    prerequisites = Column(JSON, default=list) # List of strings
    total_copies = Column(Integer, default=5)
    available_copies = Column(Integer, default=5)
    shelf_id = Column(Integer, ForeignKey("library_shelves.id"), nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    subject_rel = relationship("Subject", back_populates="books")
    shelf_rel = relationship("LibraryShelf", back_populates="books")
    borrow_transactions = relationship("BorrowTransaction", back_populates="book")
    reservations = relationship("Reservation", back_populates="book")
    selected_by_users = relationship("UserSelectedBook", back_populates="book")
    rag_chunks = relationship("RAGChunk", back_populates="book", cascade="all, delete-orphan")

class UserSelectedBook(Base):
    __tablename__ = "user_selected_books"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="selected_books")
    book = relationship("Book", back_populates="selected_by_users")

class BorrowTransaction(Base):
    __tablename__ = "borrow_transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    issue_date = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="ISSUED") # ISSUED, RETURNED, OVERDUE
    fine_amount = Column(Float, default=0.0)
    issued_by = Column(String(100), default="System Admin")
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="borrow_transactions")
    book = relationship("Book", back_populates="borrow_transactions")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    request_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED, FULFILLED
    admin_notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="reservations")
    book = relationship("Book", back_populates="reservations")

class RAGChunk(Base):
    __tablename__ = "rag_chunks"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=True)
    chunk_type = Column(String(50), default="book_metadata") # book_metadata, policy, navigation, subject
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    book = relationship("Book", back_populates="rag_chunks")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
