# LPU LIBRARY INTELLIGENT ASSISTANT 2.0 — Where Knowledge Comes Alive

A complete, production-ready, AI-powered Library Management and Navigation System built for **Lovely Professional University**.

---

## 🏛️ System Overview

LPU Library 2.0 integrates:
- **FastAPI Python Backend** with normalized SQL tables and role-based access control.
- **xAI Grok-powered RAG Assistant** with grounded library context and real-time source citations.
- **Student Dashboard** for personal profiles, borrowed books tracking, and reservations.
- **Admin Management Console** for book cataloging, circulation (issue/return), student accounts, and library layout hierarchy.
- **Physical Library Navigation Engine** with building, floor, section, rack, and shelf coordinates.
- **Cinematic Dark/Light Theme System** adhering to black (`#080808`) and crimson (`#DC2626`) identity.

---

## 🚀 Services & Endpoints

| Service | Port / URL | Status | Description |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | `http://localhost:5173/` | **Online** | React 19 + TypeScript + Tailwind CSS |
| **FastAPI Backend** | `http://127.0.0.1:8000/` | **Online** | RESTful API Engine & Swagger Docs |
| **Swagger API Docs** | `http://127.0.0.1:8000/docs` | **Online** | Interactive API Documentation |

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Student / Staff ID | Features Available |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@lpu.in` | `Admin@123` | `LPU-ADMIN-01` | Full metrics, Add/Edit books, Issue/Return circulation, User controls, Map layout |
| **Student** | `student@lpu.in` | `Student@123` | `12104589` | Personal reading shelf, Profile editor, Active loan tracker, Reservation history |

*(Tip: In the web UI, click **Sign In** and use the **"Demo Student"** or **"Demo Admin"** one-click buttons)*

---

## 🗄️ Database Schema & Storage

The system uses SQLAlchemy ORM with support for PostgreSQL (e.g. Neon) and SQLite fallback (`backend/library.db`):

- `users` & `roles` (ADMIN / STUDENT with bcrypt password hashing)
- `books`, `subjects`, and `rag_chunks`
- `library_buildings`, `library_floors`, `library_sections`, and `library_shelves`
- `borrow_transactions` (Issue date, Due date, Return date, Fines)
- `reservations` (Pending, Approved, Rejected, Fulfilled)
- `activity_logs` (Audit tracking for student and admin operations)

---

## 🤖 xAI Grok API Configuration

The assistant connects to xAI Grok at `https://api.x.ai/v1`.

To enable Grok-2 neural generation:
1. Open `backend/.env`.
2. Add your xAI API key:
   ```env
   XAI_API_KEY=xai-xxxxxxxxxxxxxxxxxxxx
   GROK_MODEL=grok-2-latest
   ```
3. Restart the FastAPI backend or reload uvicorn.
*(If no key is configured, the system gracefully falls back to local RAG grounding with zero errors)*

---

## 🛠️ How to Run the Project

### 1. Start the Backend (FastAPI):
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start the Frontend (Vite):
```powershell
npm run dev -- --host 0.0.0.0 --port 5173
```
Open **`http://localhost:5173`** in your browser.
