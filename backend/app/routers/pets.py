from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.pets import Pet
from app.schema.pets import PetCreate, ShowPet, PetUpdateStatus

router = APIRouter(prefix="/pets", tags=["Pets"])

# Create Pet
@router.post("/", response_model=ShowPet)
def create_pet(pet: PetCreate, db: Session = Depends(get_db)):
    new_pet = Pet(**pet.model_dump())  #concert pydantic model to dict
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet

# Get Pets with Filtering and Sorting
@router.get("/", response_model=List[ShowPet])
def get_pets(
    species: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    health_status: Optional[str] = None,
    owner_id: Optional[int] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    query = db.query(Pet)
    if species:
        query = query.filter(Pet.species == species)
    if min_age is not None:
        query = query.filter(Pet.age_months >= min_age)
    if max_age is not None:
        query = query.filter(Pet.age_months <= max_age)
    if health_status:
        query = query.filter(Pet.health_status == health_status)
    if owner_id:
        query = query.filter(Pet.owner_id == owner_id)

    if sort_by:
        sort_col = getattr(Pet, sort_by, None)  #if col
        if sort_col is not None:
            query = query.order_by(sort_col.asc() if order == "asc" else sort_col.desc())

    return query.all()

# Search Pets by Name or Breed
@router.get("/search/", response_model=List[ShowPet])
def search_pets(q: str = Query(...), db: Session = Depends(get_db)):
    return db.query(Pet).filter(
        (Pet.name.ilike(f"%{q}%")) | (Pet.breed.ilike(f"%{q}%"))
    ).all()

# Get Pet Details
@router.get("/{pet_id}", response_model=ShowPet)
def get_pet(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet

# Update Pet Health Status
@router.patch("/{pet_id}/status", response_model=ShowPet)
def update_pet_status(pet_id: int, status: PetUpdateStatus, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    pet.health_status = status.health_status
    db.commit()
    db.refresh(pet)
    return pet
