from fastapi import FastAPI
from app.db.database import engine, Base

from app.models.owners import Owner
from app.models.pets import Pet
from app.models.appointments import Appointment
from app.models.vaccination import Vaccination
from app.models.users import User
from app.models.billing import Invoice, InvoiceItem, Payment

Base.metadata.create_all(bind=engine)

from app.routers import owners as owners_router
from app.routers import pets as pets_router
from app.routers import appointments as appt_router
from app.routers import vaccination as vacc_router
from app.routers import auth as auth_router
from app.routers import notifications as notifications_router
from app.routers import billing as billing_router
from fastapi.middleware.cors import CORSMiddleware


from contextlib import asynccontextmanager
from app.db.database import SessionLocal
from app.auth.security import get_password_hash

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed admin user
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@petcare.com").first()
        if not admin:
            hashed = get_password_hash("admin123")
            new_admin = User(email="admin@petcare.com", hashed_password=hashed, role="staff")
            db.add(new_admin)
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(title="Pet Care Management API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (update this to your Netlify URL for better security)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Create uploads dir if it doesn't exist
os.makedirs("uploads", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from app.routers import emr as emr_router

app.include_router(owners_router.router)
app.include_router(pets_router.router)
app.include_router(appt_router.router)
app.include_router(vacc_router.router)
app.include_router(auth_router.router)
app.include_router(notifications_router.router)
app.include_router(billing_router.router)
app.include_router(emr_router.router)
