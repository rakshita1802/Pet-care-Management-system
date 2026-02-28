from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    vaccine_name = Column(String, nullable=False)
    administered_date = Column(Date, nullable=False)
    next_due_date = Column(Date)
    veterinarian_name = Column(String)
    notes = Column(Text)

    pets = relationship("Pet", back_populates="vaccinations")
