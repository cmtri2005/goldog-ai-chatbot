from pydantic import BaseModel, Field
from typing import List

class Coordinates(BaseModel):
    """Model representing a coordinates of an address"""
    lat: float = Field(..., description="Latitude of the address")
    lng: float = Field(..., description="Longitude of the address")

class Address(BaseModel):
    """Model representing an address"""
    street: str = Field(default=[], description="Street of the address")
    ward: str = Field(default=[], description="Ward of the address")
    district: str = Field(default=[], description="District of the address")
    city: str = Field(default=[], description="City of the address")
    coordinates: Coordinates = Field(..., description="Coordinates of the address")


