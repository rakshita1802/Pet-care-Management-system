from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

# Invoice Item Schemas
class InvoiceItemBase(BaseModel):
    description: str
    quantity: int = 1
    unit_price: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int

    class Config:
        from_attributes = True

# Payment Schemas
class PaymentBase(BaseModel):
    amount_paid: float
    payment_method: str

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    invoice_id: int
    payment_date: datetime

    class Config:
        from_attributes = True

# Invoice Schemas
class InvoiceBase(BaseModel):
    owner_id: int
    appointment_id: Optional[int] = None
    due_date: date

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceResponse(InvoiceBase):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[InvoiceItemResponse]
    payments: List[PaymentResponse]

    class Config:
        from_attributes = True
