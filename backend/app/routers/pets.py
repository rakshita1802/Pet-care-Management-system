from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.pets import Pet
from app.models.users import User
from app.schema.pets import PetCreate, ShowPet, PetUpdateStatus
from app.auth.dependencies import get_current_user, get_current_staff_user

router = APIRouter(prefix="/pets", tags=["Pets"])

# Create Pet (Staff only? Or can Customer create pet? Let's say Staff only or Customer if owner_id matches)
@router.post("/", response_model=ShowPet)
def create_pet(pet: PetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "customer" and pet.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to add pets for other owners")

    new_pet = Pet(**pet.model_dump())
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
    current_user: User = Depends(get_current_user)
):
    query = db.query(Pet)
    
    # RBAC restriction
    if current_user.role == "customer":
        query = query.filter(Pet.owner_id == current_user.owner_id)
    elif owner_id:
        query = query.filter(Pet.owner_id == owner_id)

    if species:
        query = query.filter(Pet.species == species)
    if min_age is not None:
        query = query.filter(Pet.age_months >= min_age)
    if max_age is not None:
        query = query.filter(Pet.age_months <= max_age)
    if health_status:
        query = query.filter(Pet.health_status == health_status)

    if sort_by:
        sort_col = getattr(Pet, sort_by, None)
        if sort_col is not None:
            query = query.order_by(sort_col.asc() if order == "asc" else sort_col.desc())

    return query.all()

# Search Pets by Name or Breed (Staff only for full DB, Customer only for their pets)
@router.get("/search/", response_model=List[ShowPet])
def search_pets(q: str = Query(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Pet).filter(
        (Pet.name.ilike(f"%{q}%")) | (Pet.breed.ilike(f"%{q}%"))
    )
    if current_user.role == "customer":
        query = query.filter(Pet.owner_id == current_user.owner_id)
    return query.all()

# Get Pet Details
@router.get("/{pet_id}", response_model=ShowPet)
def get_pet(pet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    if current_user.role == "customer" and pet.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this pet")
        
    return pet

# Update Pet Health Status (Staff only)
@router.patch("/{pet_id}/status", response_model=ShowPet)
def update_pet_status(pet_id: int, status: PetUpdateStatus, db: Session = Depends(get_db), current_user: User = Depends(get_current_staff_user)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    pet.health_status = status.health_status
    db.commit()
    db.refresh(pet)
    return pet
