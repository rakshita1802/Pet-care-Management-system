from fastapi import FastAPI
from app.db.database import engine, Base

from app.models.owners import Owner
from app.models.pets import Pet
from app.models.appointments import Appointment
from app.models.vaccination import Vaccination

Base.metadata.create_all(bind=engine)



from app.routers import owners as owners_router
from app.routers import pets as pets_router
from app.routers import appointments as appt_router
from app.routers import vaccination as vacc_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Pet Care Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(owners_router.router)
app.include_router(pets_router.router)
app.include_router(appt_router.router)
app.include_router(vacc_router.router)

