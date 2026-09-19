from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.auth.dependencies import get_current_staff_user
from app.services.notifications import process_due_reminders

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
    responses={404: {"description": "Not found"}},
)

@router.post("/trigger-due-reminders")
def trigger_reminders(db: Session = Depends(get_db), current_user = Depends(get_current_staff_user)):
    """
    Triggers the daily sweep for upcoming due dates and sends reminder emails.
    Protected endpoint: Only staff/admin accounts can trigger this.
    (In production, a cron service would log in as staff to hit this endpoint).
    """
    try:
        result = process_due_reminders(db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process reminders: {str(e)}"
        )
