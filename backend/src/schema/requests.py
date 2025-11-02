from pydantic import BaseModel, Field


class UserInput(BaseModel):
    user_input: str = Field(description="User input", default="")
    session_id: str = Field(description="Session Id", default="")
    user_id: str = Field(description="User id", default="")
