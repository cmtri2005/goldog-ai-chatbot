from datetime import datetime
from typing import Annotated, List, Optional
from pydantic import BaseModel, BeforeValidator, Field
from src.schema.address import Address
from src.schema.contact import ContactRealtor
from src.utils.pydantic_utils import none_to_empty_list


class RealEstate(BaseModel):
    """
    Model representing a real estate.

    Many fields are optional to allow returning partial metadata from the
    retrieved documents without failing validation.
    """

    title: Optional[str] = Field(None, description="Title of the real estate")
    address: Annotated[List[Address], BeforeValidator(none_to_empty_list)] = Field(
        default_factory=list, description="Address of the real estate"
    )
    description: Optional[str] = Field(
        None, description="Description of the real estate"
    )
    propertyType: Optional[str] = Field(
        None, description="Property type of the real estate"
    )
    transactionType: Optional[str] = Field(
        None, description="Transaction type of the real estate"
    )
    legalStatus: Optional[str] = Field(
        None, description="Legal status of the real estate"
    )
    price: Optional[float] = Field(None, description="Price of the real estate")
    priceUnit: Optional[str] = Field(None, description="Price unit of the real estate")
    area: Optional[float] = Field(None, description="Area of the real estate")
    direction: Optional[str] = Field(None, description="Direction of the real estate")
    images: Annotated[List[str], BeforeValidator(none_to_empty_list)] = Field(
        default_factory=list, description="Images of the real estate"
    )
    contactRealtor: Optional[ContactRealtor] = Field(
        None, description="Contact of the realtor"
    )
    source: Optional[str] = Field(
        None, description="Source (url) of the real estate posting"
    )
    publishedAt: Optional[datetime] = Field(
        None, description="Published date of the real estate posting"
    )
    updatedAt: Optional[datetime] = Field(
        None, description="Updated date of the real estate posting"
    )
