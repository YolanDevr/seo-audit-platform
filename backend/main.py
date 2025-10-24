import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import requests as requests_router
from routers import admin as admin_router
from routers import files as files_router

load_dotenv()

app = FastAPI(title=os.getenv("APP_NAME", "SEO Audit API"))

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(requests_router.router, prefix="/requests", tags=["requests"]) 
app.include_router(admin_router.router, prefix="/admin", tags=["admin"]) 
app.include_router(files_router.router, prefix="/files", tags=["files"]) 

@app.get("/")
def root():
    return {"status": "ok"}
