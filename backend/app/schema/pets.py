from pydantic import BaseModel
from typing import Optional

class PetBase(BaseModel):
    name: str
    species: str
    breed: str
    age_months: int
    weight: float
    health_status: str
    owner_id: int

class PetCreate(PetBase):
    pass

class PetUpdateStatus(BaseModel):
    health_status: str

class ShowPet(PetBase):
    id: int

    class Config:
        from_attributes = True  
