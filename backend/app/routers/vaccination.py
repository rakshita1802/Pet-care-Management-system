from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.db.database import get_db
from app.models.vaccination import Vaccination
from app.models.pets import Pet
from app.schema.vaccination import VaccinationCreate, ShowVaccination

router = APIRouter(
    prefix="/vaccinations",
    tags=["vaccinations"]
)


# 1. Record a Vaccination
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ShowVaccination)
def record_vaccination(request: VaccinationCreate, db: Session = Depends(get_db)):
    # Check pet exists
    pet = db.query(Pet).filter(Pet.id == request.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    new_record = Vaccination(
        pet_id=request.pet_id,
        vaccine_name=request.vaccine_name,
        administered_date=request.administered_date,
        next_due_date=request.next_due_date,
        veterinarian_name=request.veterinarian_name,
        notes=request.notes
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


# 2. Get Vaccinations Due
@router.get("/due/", response_model=List[ShowVaccination])
def get_due_vaccinations(db: Session = Depends(get_db)):
    today = date.today()
    due = (
        db.query(Vaccination).filter
        (
            Vaccination.next_due_date != None,
            Vaccination.next_due_date <= today
        )
        .all()
    )
    return due


# 3. Get All Vaccinations
@router.get("/", response_model=List[ShowVaccination])
def get_all_vaccinations(db: Session = Depends(get_db)):
    return db.query(Vaccination).all()
