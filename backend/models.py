from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class AuditRequest(Base):
    __tablename__ = "audit_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    website = Column(String(500), nullable=False)
    notes = Column(Text, nullable=True)
    payment_status = Column(String(50), default="pending")
    audit_status = Column(String(50), default="queued")
    report_path = Column(String(500), nullable=True)
    download_token = Column(String(200), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
