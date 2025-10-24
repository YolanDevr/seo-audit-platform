import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from schemas import AuditRequestCreate, AuditRequestOut
from crud import create_audit_request, init_db
from email_utils import send_request_received

router = APIRouter()

# ensure tables
init_db(Base, engine)

STRIPE_CHECKOUT_URL = os.getenv("STRIPE_CHECKOUT_URL", "")

@router.post("/", response_model=AuditRequestOut)
def create_request(payload: AuditRequestCreate, db: Session = Depends(get_db)):
    item = create_audit_request(db, payload)
    try:
        send_request_received(item.name, item.email)
    except Exception as e:
        print("email error", e)
    return item

@router.get("/stripe-checkout")
def get_checkout_url():
    if not STRIPE_CHECKOUT_URL:
        raise HTTPException(status_code=500, detail="Stripe link not configured")
    return {"url": STRIPE_CHECKOUT_URL}
