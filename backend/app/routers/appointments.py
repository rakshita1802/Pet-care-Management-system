from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.db.database import get_db
from app.models.pets import Pet
from app.models.appointments import Appointment
from app.schema.appointments import (
    AppointmentCreate,
    ShowAppointment,
    UpdateAppointmentStatus,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# CREATE / SCHEDULE APPOINTMENT
@router.post("/", response_model=ShowAppointment)
def schedule_appointment(
    appt: AppointmentCreate,
    db: Session = Depends(get_db)
):
    pet = db.query(Pet).filter(Pet.id == appt.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    new_appt = Appointment(
        pet_id=appt.pet_id,
        owner_id=pet.owner_id,
        appointment_date=appt.appointment_date,
        appointment_type=appt.appointment_type,
        description=appt.description,
        status=appt.status,
    )

    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return new_appt


# GET APPOINTMENTS 
@router.get("/", response_model=List[ShowAppointment])
def get_appointments(
    appointment_date: Optional[date] = None,
    status: Optional[str] = None,
    pet_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    today = date.today()

    appointments = db.query(Appointment).all()

    # STATUS CHECK
    updated = False
    for appt in appointments:
        if (
            appt.status == "Scheduled"
            and appt.appointment_date < today
        ):
            appt.status = "Completed"
            updated = True

    if updated:
        db.commit()

    #  APPLY FILTERS 
    if appointment_date:
        appointments = [
            a for a in appointments
            if a.appointment_date == appointment_date
        ]

    if status:
        appointments = [
            a for a in appointments
            if a.status == status
        ]

    if pet_id:
        appointments = [
            a for a in appointments
            if a.pet_id == pet_id
        ]

    return appointments


# UPDATE APPOINTMENT STATUS (MANUAL)
@router.patch("/{appointment_id}/status", response_model=ShowAppointment)
def update_appointment_status(
    appointment_id: int,
    update: UpdateAppointmentStatus,
    db: Session = Depends(get_db),
):
    appt = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = update.status
    db.commit()
    db.refresh(appt)

    return appt
