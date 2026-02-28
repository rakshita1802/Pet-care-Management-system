from typing import List, Optional
import re
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.models.owners import Owner
from app.db.database import get_db
from app.schema.owners import OwnerCreate, OwnerUpdate, ShowOwner

router = APIRouter(prefix="/owners", tags=["owners"])

# VALIDATION

def validate_owner_data(request: OwnerCreate):
    if not request.name.strip():
        raise HTTPException(status_code=400, detail="Owner name is required")

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", request.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if not re.match(r"^[0-9]{10}$", request.phone):
        raise HTTPException(status_code=400, detail="Phone number must be 10 digits")


# CREATE OWNER
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ShowOwner)
def create_owner(request: OwnerCreate, db: Session = Depends(get_db)):

    validate_owner_data(request)

    #  EMAIL validation
    existing_email = db.query(Owner).filter(Owner.email == request.email).first()
    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="An owner with this email already exists"
        )

    # PHONE validation
    existing_phone = db.query(Owner).filter(Owner.phone == request.phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=409,
            detail="An owner with this phone number already exists"
        )

    new_owner = Owner(
        name=request.name.strip(),
        email=request.email.strip().lower(),
        phone=request.phone,
        address=request.address.strip() if request.address else None
    )

    db.add(new_owner)
    db.commit()
    db.refresh(new_owner)

    return new_owner


# GET ALL OWNERS
@router.get("/", response_model=List[ShowOwner])
def get_all_owners(
    search: Optional[str] = None,  # Query param
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Owner)

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Owner.name.ilike(s)) |
            (Owner.email.ilike(s)) |
            (Owner.phone.ilike(s))
        )

    owners = query.offset(skip).limit(limit).all()

    for owner in owners:
        owner.pet_count = len(owner.pets)

    return owners


# GET OWNER BY ID
@router.get("/{owner_id}", response_model=ShowOwner)
def get_owner(owner_id: int, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    owner.pet_count = len(owner.pets)
    return owner


# UPDATE OWNER
@router.put("/{owner_id}", response_model=ShowOwner)
def update_owner(owner_id: int, request: OwnerUpdate, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    for field, value in request.dict(exclude_unset=True).items():
        setattr(owner, field, value)

    db.commit()
    db.refresh(owner)
    owner.pet_count = len(owner.pets)

    return owner


# DELETE OWNER
@router.delete("/{owner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_owner(owner_id: int, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.id == owner_id).first()

    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    db.delete(owner)
    db.commit()
