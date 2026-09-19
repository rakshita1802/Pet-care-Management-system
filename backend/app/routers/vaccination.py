from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional

from app.db.database import get_db
from app.models.vaccination import Vaccination
from app.models.pets import Pet
from app.models.users import User
from app.schema.vaccination import VaccinationCreate, ShowVaccination
from app.auth.dependencies import get_current_user, get_current_staff_user

router = APIRouter(
    prefix="/vaccinations",
    tags=["vaccinations"]
)

# 1. Record a Vaccination (Staff only)
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ShowVaccination)
def record_vaccination(
    request: VaccinationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_staff_user)
):
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


# 2. Get Vaccinations Due (Customer can see their own, Staff see all)
@router.get("/due/", response_model=List[ShowVaccination])
def get_due_vaccinations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    query = db.query(Vaccination).join(Pet).filter(
        Vaccination.next_due_date != None,
        Vaccination.next_due_date <= today
    )

    if current_user.role == "customer":
        query = query.filter(Pet.owner_id == current_user.owner_id)

    return query.all()


# 3. Get All Vaccinations (Filter by pet_id optionally)
@router.get("/", response_model=List[ShowVaccination])
def get_all_vaccinations(
    pet_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vaccination).join(Pet)

    if current_user.role == "customer":
        query = query.filter(Pet.owner_id == current_user.owner_id)
    
    if pet_id:
        query = query.filter(Vaccination.pet_id == pet_id)

    return query.all()
