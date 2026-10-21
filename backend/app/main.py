from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title="Sinnchem Life Sciences API",
    version="1.0.0",
    description="Contact and career application endpoints for the Sinnchem website.",
    docs_url=None if settings.app_env == "production" else "/docs",
    redoc_url=None if settings.app_env == "production" else "/redoc",
    openapi_url=None if settings.app_env == "production" else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(router, prefix="/api")


@app.get("/")
async def root() -> dict[str, str]:
    response = {
        "service": "Sinnchem Life Sciences API",
        "status": "ok",
        "health": "/health",
    }
    if settings.app_env != "production":
        response["docs"] = "/docs"
    return response


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
