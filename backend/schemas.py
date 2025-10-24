from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional

class AuditRequestCreate(BaseModel):
    name: str
    email: EmailStr
    website: HttpUrl | str
    notes: Optional[str] = None

class AuditRequestOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    website: str
    notes: Optional[str]
    payment_status: str
    audit_status: str
    created_at: str
    class Config:
        from_attributes = True

class AuditRequestUpdate(BaseModel):
    payment_status: Optional[str] = None
    audit_status: Optional[str] = None

class SendReportPayload(BaseModel):
    message: Optional[str] = None
