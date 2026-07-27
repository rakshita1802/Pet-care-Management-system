# 🐾 Pet Care Management System

A full-stack application designed to manage pet care clinic operations, including **pet owners, pets, appointments, and vaccination tracking**.

---

## 📁 Repository Structure

```text
Pet-care-Management-system/
│
├── backend/
│   ├── app/
│   │   ├── core/          # Application configurations
│   │   ├── crud/          # Base and entity-specific CRUD logic
│   │   ├── db/            # Database setup and connection scripts
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── routers/       # API endpoints / controllers
│   │   └── schema/        # Pydantic schemas for data validation
│   │
│   ├── main.py             # FastAPI entry point
│   └── requirements.txt    # Backend dependencies
│
├── frontend/               # User interface application
│
└── .gitignore
```

---

## ✨ Features

### 👤 Owners Management
- Add pet owner information
- Update owner details
- View owner profiles

### 🐶 Pet Profiles
- Create and manage pet profiles
- Store pet details
- Link pets with their respective owners

### 📅 Appointment Scheduling
- Schedule clinic appointments
- Manage upcoming visits
- View appointment details

### 💉 Vaccination Records
- Track vaccination history
- Manage upcoming vaccination schedules
- View vaccination records for each pet

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy ORM
- Pydantic

### Database
- SQLite
- PostgreSQL / MySQL

### Frontend
- HTML
- CSS
- JavaScript
- SPA Framework (if applicable)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.8+
- Node.js and npm (if using a JavaScript frontend)

---

## ⚙️ Backend Setup

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Create a Virtual Environment

#### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the API Server

```bash
uvicorn app.main:app --reload
```

The backend server will start at:

**http://127.0.0.1:8000**

### API Documentation

Interactive Swagger API documentation is available at:

**http://127.0.0.1:8000/docs**

---

## 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

If your frontend uses npm:

```bash
npm install
npm start
```

If you are using Vite:

```bash
npm install
npm run dev
```

---

## 🔗 API Endpoints

| Module | Endpoint | Description |
|---|---|---|
| Owners | `/owners` | Manage pet owners |
| Pets | `/pets` | Manage pet profiles |
| Appointments | `/appointments` | Schedule and manage appointments |
| Vaccinations | `/vaccinations` | Manage vaccination records |

---

## 📌 Project Modules

### Owners
CRUD operations for pet owners.

### Pets
Manage pet profiles and owner relationships.

### Appointments
Schedule, update, and view clinic appointments.

### Vaccinations
Record vaccination history and track upcoming vaccinations.

---

## 📄 License

This project is developed for educational and academic purposes.
