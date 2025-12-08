from pydantic import BaseModel, Field
from typing import List


class ContactRealtor(BaseModel):
    """Model representing a contact of a realtor"""

    name: str = Field(default=[], description="Name of the contact of a realtor")
    phone: str = Field(..., description="Phone number of the contact of a realtor")
    zalo: str = Field(
        default=[], description="The Zalo number of the contact of a realtor"
    )
    email: str = Field(default=[], description="Email of the contact of a realtor")
