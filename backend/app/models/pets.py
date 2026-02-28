from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Pet(Base):
    __tablename__ = "pets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    species = Column(String)
    breed = Column(String)
    age_months = Column(Integer)
    weight = Column(Float)
    health_status = Column(String)
    owner_id = Column(Integer, ForeignKey("owners.id"))

    owner = relationship("Owner", back_populates="pets")
    appointments = relationship("Appointment", back_populates="pets", cascade="all, delete-orphan")
  # only once, correct
    vaccinations = relationship("Vaccination", back_populates="pets", cascade="all, delete-orphan", passive_deletes=True) 