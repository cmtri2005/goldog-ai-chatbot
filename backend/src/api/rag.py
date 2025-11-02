from fastapi import Request
from src.services.application.rag import RagPipeline


def get_rag_service(request: Request) -> RagPipeline:
    return request.app.state.rag_service
