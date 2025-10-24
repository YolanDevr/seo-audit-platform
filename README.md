# SEO Audit Platform

A production-ready platform for a solo freelancer to collect SEO audit requests, manage statuses, and deliver PDF reports.

- Frontend: Next.js + Tailwind CSS (deployable to Vercel)
- Backend: FastAPI + SQLite (deployable to Render)
- Email: SMTP via environment variables
- Payments: Redirect to a pre-configured Stripe payment link

## Structure

- frontend/ — Next.js app (landing, request form, thank-you, admin dashboard)
- backend/ — FastAPI API (SQLite DB, email, file upload, admin token)

## Quick start

1) Backend
- Copy backend/.env.example to backend/.env and fill values
- Create a virtualenv and install deps:
  python -m venv .venv
  .venv/Scripts/activate
  pip install -r backend/requirements.txt
- Run locally:
  uvicorn main:app --reload --port 8000 --host 0.0.0.0

2) Frontend
- Copy frontend/.env.example to frontend/.env.local and fill values
- Install deps and run dev:
  npm install
  npm run dev

## Deployment

- Backend on Render:
  - Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
  - Add environment variables from backend/.env.example
  - Persistent disk for /app/files if you need reports storage

- Frontend on Vercel:
  - Set NEXT_PUBLIC_API_BASE to your Render backend URL
  - Build command: next build
  - Output: .next

## Notes
- Payment verification is simplified: payment status can be toggled in admin after Stripe checkout.
- File download links are tokenized per request.
