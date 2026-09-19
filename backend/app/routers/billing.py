from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.auth.dependencies import get_current_user, get_current_staff_user
from app.models.billing import Invoice, InvoiceItem, Payment
from app.models.users import User
from app.models.owners import Owner
from app.schema.billing import InvoiceCreate, InvoiceResponse, PaymentCreate, PaymentResponse

router = APIRouter(
    prefix="/invoices",
    tags=["Billing"],
)

@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), staff: User = Depends(get_current_staff_user)):
    # Calculate total amount
    total = sum(item.quantity * item.unit_price for item in invoice.items)
    
    db_invoice = Invoice(
        owner_id=invoice.owner_id,
        appointment_id=invoice.appointment_id,
        due_date=invoice.due_date,
        total_amount=total,
        status="Pending"
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    for item in invoice.items:
        db_item = InvoiceItem(
            invoice_id=db_invoice.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/", response_model=List[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "staff":
        return db.query(Invoice).all()
    else:
        # Customer only sees their own invoices
        owner = db.query(Owner).filter(Owner.id == current_user.owner_id).first()
        if not owner:
            return []
        return db.query(Invoice).filter(Invoice.owner_id == owner.id).all()

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    if current_user.role == "customer" and invoice.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this invoice")
        
    return invoice

@router.post("/{invoice_id}/pay", response_model=PaymentResponse)
def pay_invoice(invoice_id: int, payment: PaymentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    if current_user.role == "customer" and invoice.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized to pay this invoice")

    if invoice.status == "Paid":
        raise HTTPException(status_code=400, detail="Invoice is already paid")

    db_payment = Payment(
        invoice_id=invoice.id,
        amount_paid=payment.amount_paid,
        payment_method=payment.payment_method
    )
    db.add(db_payment)
    
    # Check if fully paid
    total_paid = sum(p.amount_paid for p in invoice.payments) + payment.amount_paid
    if total_paid >= invoice.total_amount:
        invoice.status = "Paid"
        
    db.commit()
    db.refresh(db_payment)
    
    return db_payment
