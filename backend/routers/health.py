import os
from pathlib import Path

from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import engine

router = APIRouter()


def check_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True, None
    except SQLAlchemyError as exc:  # pragma: no cover - lightweight health probe
        return False, str(exc)


def check_files_dir():
    files_dir = os.getenv("FILES_DIR", "./files")
    path = Path(files_dir)
    try:
        path.mkdir(parents=True, exist_ok=True)
        probe = path / ".healthcheck"
        probe.write_text("ok")
        probe.unlink(missing_ok=True)
        return True, files_dir
    except OSError as exc:  # pragma: no cover - lightweight health probe
        return False, f"{files_dir} ({exc})"


@router.get("/")
def health():
    db_ready, db_detail = check_database()
    files_ready, files_detail = check_files_dir()

    stripe_ready = bool(os.getenv("STRIPE_CHECKOUT_URL"))
    admin_ready = bool(os.getenv("ADMIN_TOKEN"))
    smtp_ready = bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_USER") and os.getenv("SMTP_PASS"))

    all_required_ready = all([db_ready, files_ready, stripe_ready, admin_ready])

    return {
        "status": "ok" if all_required_ready else "warn",
        "checks": {
            "database": {"ready": db_ready, "detail": db_detail},
            "files_dir": {"ready": files_ready, "detail": files_detail},
            "stripe_configured": stripe_ready,
            "admin_token_configured": admin_ready,
            "smtp_configured": smtp_ready,
        },
    }
