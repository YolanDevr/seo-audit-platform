import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from database import get_db
from crud import list_requests, update_request, attach_report, get_request
from schemas import AuditRequestOut, AuditRequestUpdate, SendReportPayload
from email_utils import send_report_ready

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
FILES_DIR = os.getenv("FILES_DIR", "./files")

router = APIRouter()


def require_admin(x_admin_token: str = Header(None)):
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=500, detail="Admin token not configured")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

@router.get("/requests", response_model=list[AuditRequestOut])
def admin_list_requests(db: Session = Depends(get_db), _: None = Depends(require_admin)):
    return list_requests(db)

@router.patch("/requests/{req_id}", response_model=AuditRequestOut)
def admin_update_request(req_id: int, payload: AuditRequestUpdate, db: Session = Depends(get_db), _: None = Depends(require_admin)):
    item = update_request(db, req_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item

@router.post("/requests/{req_id}/upload", response_model=AuditRequestOut)
async def admin_upload_report(req_id: int, pdf: UploadFile = File(...), db: Session = Depends(get_db), _: None = Depends(require_admin)):
    os.makedirs(FILES_DIR, exist_ok=True)
    filename = f"{req_id}_{pdf.filename}"
    path = os.path.join(FILES_DIR, filename)
    with open(path, "wb") as f:
        f.write(await pdf.read())
    item = attach_report(db, req_id, filename)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item

@router.post("/requests/{req_id}/send-report")
async def admin_send_report(req_id: int, payload: SendReportPayload, db: Session = Depends(get_db), _: None = Depends(require_admin)):
    item = get_request(db, req_id)
    if not item or not item.report_path:
        raise HTTPException(status_code=400, detail="Report not uploaded")
    download_url = f"{os.getenv('BASE_URL', 'http://localhost:8000')}/files/download/{item.download_token}"
    try:
        send_report_ready(item.name, item.email, download_url)
    except Exception as e:
        print("email error", e)
    return {"status": "sent", "download_url": download_url}
