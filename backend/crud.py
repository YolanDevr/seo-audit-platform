import os
import secrets
from sqlalchemy.orm import Session
from models import AuditRequest
from schemas import AuditRequestCreate, AuditRequestUpdate

FILES_DIR = os.getenv("FILES_DIR", "./files")

def init_db(Base, engine):
    Base.metadata.create_all(bind=engine)

def create_audit_request(db: Session, payload: AuditRequestCreate) -> AuditRequest:
    item = AuditRequest(
        name=payload.name,
        email=payload.email,
        website=str(payload.website),
        notes=payload.notes,
        payment_status="pending",
        audit_status="queued",
        download_token=secrets.token_urlsafe(24),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def list_requests(db: Session):
    return db.query(AuditRequest).order_by(AuditRequest.created_at.desc()).all()

def get_request(db: Session, req_id: int):
    return db.query(AuditRequest).filter(AuditRequest.id == req_id).first()

def update_request(db: Session, req_id: int, data: AuditRequestUpdate):
    item = get_request(db, req_id)
    if not item:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

def attach_report(db: Session, req_id: int, filename: str):
    item = get_request(db, req_id)
    if not item:
        return None
    item.report_path = filename
    db.commit()
    db.refresh(item)
    return item
