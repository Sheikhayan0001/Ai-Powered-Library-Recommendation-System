from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.database.connection import engine, Base
from app.routes import auth, books, borrowing, navigation, chat, admin, users

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI-powered Library Management System for LPU",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all for smooth front-end binding
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory mounting
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(os.path.join(UPLOAD_DIR, "avatars"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(books.router, prefix=settings.API_V1_STR)
app.include_router(borrowing.router, prefix=settings.API_V1_STR)
app.include_router(navigation.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "Online",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
