from src.api.routers import rest_retrieval
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(
    rest_retrieval.router, prefix="/rest-retrieve", tags=["Rest API Retriever"]
)
