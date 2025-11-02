import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.api.routers.api import api_router
from src.config.settings import APP_CONFIGS, SETTINGS
from src.services.application.rag import RagPipeline

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.rag_service = RagPipeline()
    yield


app = FastAPI(**APP_CONFIGS, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
async def readycheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(
    api_router,
    prefix=SETTINGS.API_V1_STR,
)

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=SETTINGS.HOST,
        port=SETTINGS.PORT,
        reload=True,
    )
