import uuid
from fastapi import APIRouter, Depends, status
from src.api.rag import get_rag_service
from src.schema.requests import UserInput
from src.schema.response import Response
from src.services.application.rag import RagPipeline

router = APIRouter()


@router.post(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def rag_retrieve(
    input: UserInput, rag_service: RagPipeline = Depends(get_rag_service)
):
    print("*" * 50)
    print(f"INFO: Session id: {input.session_id} && User id: {input.user_id}")
    print("*" * 50)

    session_id = input.session_id or str(uuid.uuid4())
    user_id = input.user_id or f"user_{str(uuid.uuid4().hex[:8])}"
    response = await rag_service.get_response(
        question=input.user_input, session_id=session_id, user_id=user_id
    )
    return Response(response=response, session_id=session_id, user_id=user_id)
