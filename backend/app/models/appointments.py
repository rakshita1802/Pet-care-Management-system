from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("owners.id", ondelete="CASCADE"), nullable=False)

    appointment_date = Column(Date, nullable=False)
    appointment_type = Column(String)
    description = Column(Text)
    status = Column(String)

    created_at = Column(DateTime, default=func.now())

    pets = relationship("Pet", back_populates="appointments")
    owner = relationship("Owner", back_populates="appointments")
