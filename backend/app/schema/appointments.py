from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class AppointmentBase(BaseModel):
    pet_id: int
    appointment_date: date
    appointment_type: str
    description: Optional[str] = None
    status: Optional[str] = "Scheduled"


class AppointmentCreate(AppointmentBase):
    pass


class UpdateAppointmentStatus(BaseModel):
    status: str


class ShowAppointment(AppointmentBase):
    id: int
    owner_id: int                  
    created_at: datetime

    class Config:
        from_attributes = True
