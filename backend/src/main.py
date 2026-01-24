from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from src.helpers.db import get_db, engine, Base
from src.routes.auth_routes import router as auth_router
from src.helpers.config import Settings

# Import models to register them with Base.metadata
from src.models.db_scheams.user import User  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


# FastAPI App
app = FastAPI(
    title="Authentication System API",
    description="A simple FastAPI server with PostgreSQL connection",
    version="1.0.0",
    lifespan=lifespan,
)

# cors
origins = Settings().CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)


# Include routers
app.include_router(auth_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Authentication System API",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Check if the server and database are running correctly.
    """
    try:
        # Execute a simple query to verify database connectivity
        await db.execute(text("SELECT 1"))
        return {
            "status": "online",
            "database": "connected",
            "message": "System is healthy",
        }
    except Exception as e:
        return {
            "status": "online",
            "database": f"error: {str(e)}",
            "message": "Database connection failed",
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
