import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from fastapi import Depends
from models import AuditRequest

FILES_DIR = os.getenv("FILES_DIR", "./files")
router = APIRouter()

@router.get("/download/{token}")
def download_file(token: str, db: Session = Depends(get_db)):
    item = db.query(AuditRequest).filter(AuditRequest.download_token == token).first()
    if not item or not item.report_path:
        raise HTTPException(status_code=404, detail="Not found")
    path = os.path.join(FILES_DIR, item.report_path)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File missing")
    return FileResponse(path, media_type="application/pdf", filename=os.path.basename(path))
