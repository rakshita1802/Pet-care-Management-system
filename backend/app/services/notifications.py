import logging
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.vaccination import Vaccination
from app.models.appointments import Appointment
from app.models.pets import Pet
from app.models.owners import Owner

# Configure logging to show our "simulated" emails clearly in the terminal
logger = logging.getLogger(__name__)

def send_simulated_email(to_email: str, subject: str, body: str):
    """Simulates sending an email by printing to the server console."""
    divider = "-" * 50
    print(f"\n{divider}")
    print(f"EMAIL SENT TO: {to_email}")
    print(f"Subject: {subject}")
    print(f"\n{body}")
    print(f"{divider}\n")

def process_due_reminders(db: Session):
    """Finds upcoming due dates and sends reminder emails."""
    today = date.today()
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(days=7)

    reminders_sent = 0

    # 1. Find Appointments for Tomorrow
    upcoming_appointments = db.query(Appointment).filter(
        Appointment.appointment_date == tomorrow,
        Appointment.status == "Scheduled"
    ).all()

    for appt in upcoming_appointments:
        pet = db.query(Pet).filter(Pet.id == appt.pet_id).first()
        owner = db.query(Owner).filter(Owner.id == pet.owner_id).first()
        
        if owner and owner.email:
            subject = f"Reminder: {pet.name}'s Appointment Tomorrow!"
            body = (
                f"Hello {owner.name},\n\n"
                f"This is a friendly reminder that {pet.name} has a {appt.appointment_type} appointment "
                f"scheduled for tomorrow ({tomorrow.strftime('%B %d, %Y')}).\n\n"
                f"Description: {appt.description}\n\n"
                f"We look forward to seeing you at Happy Paws Pet Care Center!"
            )
            send_simulated_email(owner.email, subject, body)
            reminders_sent += 1

    # 2. Find Vaccinations Due in exactly 7 days
    upcoming_vaccinations = db.query(Vaccination).filter(
        Vaccination.next_due_date == next_week
    ).all()

    for vacc in upcoming_vaccinations:
        pet = db.query(Pet).filter(Pet.id == vacc.pet_id).first()
        owner = db.query(Owner).filter(Owner.id == pet.owner_id).first()

        if owner and owner.email:
            subject = f"Upcoming Vaccination Due for {pet.name}"
            body = (
                f"Hello {owner.name},\n\n"
                f"This is a reminder that {pet.name}'s {vacc.vaccine_name} vaccination is due "
                f"in one week on {next_week.strftime('%B %d, %Y')}.\n\n"
                f"Please log in to your account or call us to schedule an appointment.\n\n"
                f"Best regards,\nHappy Paws Team"
            )
            send_simulated_email(owner.email, subject, body)
            reminders_sent += 1

    return {"message": f"Successfully processed {reminders_sent} reminders."}
