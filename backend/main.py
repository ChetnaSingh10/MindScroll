"""
Vercel FastAPI entrypoint for MindScroll AI Backend.
Exports the ASGI app instance for Vercel Serverless Functions and Uvicorn.
"""
from app.main import app

__all__ = ["app"]
