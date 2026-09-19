from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    record_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    veterinarian_name = Column(String, nullable=False)
    
    # Vitals
    weight_kg = Column(Float, nullable=True)
    temperature_c = Column(Float, nullable=True)
    heart_rate_bpm = Column(Integer, nullable=True)
    
    # SOAP Notes
    subjective = Column(Text, nullable=True)
    objective = Column(Text, nullable=True)
    assessment = Column(Text, nullable=True)
    plan = Column(Text, nullable=True)

    # Relationships
    pet = relationship("Pet", backref="medical_records")
    appointment = relationship("Appointment", backref="medical_records")
    attachments = relationship("Attachment", back_populates="medical_record", cascade="all, delete-orphan")


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id", ondelete="CASCADE"), nullable=False)
    
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_url = Column(String, nullable=False) # Cloudinary URL or local path
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    medical_record = relationship("MedicalRecord", back_populates="attachments")
