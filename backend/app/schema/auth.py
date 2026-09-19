from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str # The owner's name
    phone: str
    address: Optional[str] = None
    role: Optional[str] = "customer"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True
