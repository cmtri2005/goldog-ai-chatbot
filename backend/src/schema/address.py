from typing import Optional
from pydantic import BaseModel, Field


class Address(BaseModel):
    """Model representing an address"""

    street: str = Field(default="", description="Street of the address")
    ward: str = Field(default="", description="Ward of the address")
    district: str = Field(default="", description="District of the address")
    city: str = Field(default="", description="City of the address")
    latitude: Optional[float] = Field(None, description="Latitude of the address")
    longitude: Optional[float] = Field(None, description="Longitude of the address")
