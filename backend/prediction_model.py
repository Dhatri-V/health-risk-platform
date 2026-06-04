from sqlalchemy import Column, Integer, Float, String
from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    prediction = Column(Integer)

    risk = Column(String)

    confidence = Column(Float)

    glucose = Column(Float)

    bmi = Column(Float)

    age = Column(Integer)

    timestamp = Column(String)