from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AttachmentBase(BaseModel):
    file_name: str
    file_type: str
    file_url: str

class AttachmentResponse(AttachmentBase):
    id: int
    record_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class MedicalRecordBase(BaseModel):
    pet_id: int
    appointment_id: Optional[int] = None
    veterinarian_name: str
    
    weight_kg: Optional[float] = None
    temperature_c: Optional[float] = None
    heart_rate_bpm: Optional[int] = None
    
    subjective: Optional[str] = None
    objective: Optional[str] = None
    assessment: Optional[str] = None
    plan: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    record_date: datetime
    attachments: List[AttachmentResponse] = []

    class Config:
        from_attributes = True
