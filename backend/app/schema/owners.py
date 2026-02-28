from pydantic import BaseModel, EmailStr
from typing import Optional

# BASE 
class OwnerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None 

# CREATE 
class OwnerCreate(OwnerBase):
    pass

# UPDATE 
class OwnerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    class Config:
        from_attributes = True

# RESPONSE 
class ShowOwner(OwnerBase):
    id: int
    pet_count: Optional[int] = 0

    class Config:
        orm_mode = True
