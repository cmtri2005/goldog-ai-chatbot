from typing import Any, Dict
from pathlib import Path
from pydantic_settings import BaseSettings

PROJECT_ROOT = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8080
    API_V1_STR: str = "/v1"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"


SETTINGS = Settings()

APP_CONFIGS: Dict[str, Any] = {
    "title": "Goldog-AI-Chatbot",
    "description": "A RAG-powered chatbot for real-estate question answering with AWS BEDROCK, Langchain, v.v",
    "version": "1.0.0",
    "debug": SETTINGS.DEBUG,
}
