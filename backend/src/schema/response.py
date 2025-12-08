from pydantic import BaseModel, Field
from src.schema.real_estate import RealEstate
from typing import List


class Response(BaseModel):
    """Response schema for the chat API"""

    session_id: str = Field(description="Session ID for conversation tracking")
    user_id: str = Field(description="User ID for conversation tracking")
    response: str = Field(
        description="AI respone to user's input. Example: There are n real-estates that match your request. I will provide you the list of real estates."
    )
    result: List[RealEstate] = Field(description="List of real estates")
