from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.helpers.db import get_db

# 3. FastAPI App
app = FastAPI(
    title="Authentication System API",
    description="A simple FastAPI server with PostgreSQL connection",
    version="1.0.0",
)


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
