from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid
from datetime import datetime

from app.db.database import get_db
from app.models.emr import MedicalRecord, Attachment
from app.models.pets import Pet
from app.schemas.emr import MedicalRecordCreate, MedicalRecordResponse, AttachmentResponse
from app.auth.dependencies import get_current_user
from app.models.users import User

router = APIRouter(
    prefix="/emr",
    tags=["Electronic Medical Records"]
)

@router.get("/pet/{pet_id}", response_model=List[MedicalRecordResponse])
def get_pet_medical_records(pet_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    if current_user.role == "customer" and pet.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these records")

    records = db.query(MedicalRecord).filter(MedicalRecord.pet_id == pet_id).order_by(MedicalRecord.record_date.desc()).all()
    return records

@router.post("/", response_model=MedicalRecordResponse)
def create_medical_record(record: MedicalRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff can create medical records")
        
    pet = db.query(Pet).filter(Pet.id == record.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    db_record = MedicalRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.post("/{record_id}/upload", response_model=AttachmentResponse)
def upload_attachment(record_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff can upload attachments")
        
    record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")
        
    # Generate unique filename
    ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join("uploads", unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Determine absolute URL based on host (in production it would use frontend/backend url env var)
    # For now, we will return a relative URL path and let frontend prepend backend base url
    file_url = f"/uploads/{unique_filename}"
    
    db_attachment = Attachment(
        record_id=record_id,
        file_name=file.filename,
        file_type=file.content_type,
        file_url=file_url
    )
    
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    return db_attachment
