from pydantic import BaseModel
from datetime import date
from typing import Optional

# BASE 
class VaccinationBase(BaseModel):
    pet_id: int
    vaccine_name: str
    administered_date: date
    next_due_date: Optional[date] = None
    veterinarian_name: Optional[str] = None
    notes: Optional[str] = None

# CREATE 
class VaccinationCreate(VaccinationBase):
    pass

# RESPONSE 
class ShowVaccination(BaseModel):
    id: int
    pet_id: int
    vaccine_name: str
    administered_date: date
    next_due_date: Optional[date] = None
    veterinarian_name: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True