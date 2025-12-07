from pydantic import BaseModel, Field
from typing import List
from src.schema.address import Address
from src.schema.contact import ContactRealtor
from datetime import datetime


class RealEstate(BaseModel):
    """Model representing a real estate"""
    title: str = Field(..., description="Title of the real estate")
    address: List[Address] = Field(..., description="Address of the real estate")
    description: str = Field(..., description="Description of the real estate")
    propertyType: str = Field(..., description="Property type of the real estate")
    transactionType: str = Field(..., description="Transaction type of the real estate")
    legalStatus: str = Field(description="Legal status of the real estate")
    price: float = Field(description="Price of the real estate")
    priceUnit: str = Field(description="Price unit of the real estate")
    area: float = Field(description="Area of the real estate")
    direction: str = Field(description="Direction of the real estate")
    images: List[str] = Field(description="Images of the real estate")
    contactRealtor: ContactRealtor = Field(..., description="Contact of the realtor")
    source: str = Field(..., description="Source (url) of the real estate posting")
    publishedAt: datetime = Field(description="Published date of the real estate posting")
    updatedAt: datetime = Field(description="Updated date of the real estate posting")