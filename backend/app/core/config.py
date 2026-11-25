from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "LPU LIBRARY INTELLIGENT ASSISTANT 2.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./library.db")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lpu_library_super_secret_jwt_key_2026_change_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # Google Gemini Configuration
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
