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

import stripe
import os
from fastapi import Request

# Hardcoded test keys or fallback to env
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_51Px_your_key_here")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_your_secret_here")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://petpaws-management.netlify.app")

@router.post("/{invoice_id}/create-checkout-session")
def create_checkout_session(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    if current_user.role == "customer" and invoice.owner_id != current_user.owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if invoice.status == "Paid":
        raise HTTPException(status_code=400, detail="Invoice is already paid")
        
    try:
        # Create line items for Stripe
        line_items = []
        for item in invoice.items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item.description,
                    },
                    "unit_amount": int(item.unit_price * 100), # Stripe uses cents
                },
                "quantity": item.quantity,
            })
            
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_URL}/billing?success=true",
            cancel_url=f"{FRONTEND_URL}/billing?canceled=true",
            client_reference_id=str(invoice.id),
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        invoice_id = int(session.get("client_reference_id"))
        amount_paid = session.get("amount_total", 0) / 100.0
        
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if invoice and invoice.status != "Paid":
            invoice.status = "Paid"
            db_payment = Payment(
                invoice_id=invoice.id,
                amount_paid=amount_paid,
                payment_method="Stripe Checkout"
            )
            db.add(db_payment)
            db.commit()

    return {"status": "success"}
