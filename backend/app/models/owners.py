from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Owner(Base):
    __tablename__ = "owners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(Text)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="owner")
