from pydantic import BaseModel, Field


class Response(BaseModel):
    response: str = Field(description="AI respone to user's input")
    session_id: str = Field(description="Session ID for conversation tracking")
    user_id: str = Field(description="User ID for conversation tracking")
