from pydantic import BaseModel, Field
from typing import Dict, Any, Optional


class SearchArgs(BaseModel):
    query: str = Field(
        description="User input",
        default="",
    )
    top_k: int = Field(
        description="Number of results to return",
        default=3,
    )
    with_score: bool = Field(
        description="Whether to return the score of the results",
        default=False,
    )
    metadata_filter: Optional[Dict[str, Any]] = Field(
        default=None,
        description=(
            "Optional metadata filter for search. If unused, omit this field; do not send null."
        ),
    )
