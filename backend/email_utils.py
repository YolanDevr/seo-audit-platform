import os
import smtplib
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "noreply@example.com")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


def send_email(to_email: str, subject: str, body: str):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # In dev, skip sending if not configured
        print("[email] SMTP not configured. Skipping send.")
        print(subject)
        print(body)
        return
    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


def send_request_received(name: str, email: str):
    subject = "We received your SEO audit request"
    body = f"""
    <p>Hi {name},</p>
    <p>Thanks for your request. I'll start as soon as the payment is confirmed.</p>
    <p>— Yolan Devriendt — SEO Audits</p>
    """
    send_email(email, subject, body)


def send_report_ready(name: str, email: str, download_url: str):
    subject = "Your SEO audit report is ready"
    body = f"""
    <p>Hi {name},</p>
    <p>Your SEO audit report is ready. Download it here:</p>
    <p><a href="{download_url}">{download_url}</a></p>
    <p>— Yolan Devriendt — SEO Audits</p>
    """
    send_email(email, subject, body)
