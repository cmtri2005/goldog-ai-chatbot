from typing import Optional
from pydantic import BaseModel, Field


class ContactRealtor(BaseModel):
    """Model representing a contact of a realtor"""

    name: Optional[str] = Field(
        None, description="Name of the contact of a realtor"
    )
    phone: Optional[str] = Field(
        None, description="Phone number of the contact of a realtor"
    )
    zalo: Optional[str] = Field(
        None, description="The Zalo number of the contact of a realtor"
    )
    email: Optional[str] = Field(
        None, description="Email of the contact of a realtor"
    )
