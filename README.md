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
- Copy backend/.env.example to backend/.env and fill values (see keys below)
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

## Environment variables

### Backend (.env)
- APP_NAME: optionele naam voor de FastAPI-applicatie.
- CORS_ORIGINS: komma-gescheiden lijst van toegestane origins (bv. `http://localhost:3000`).
- DATABASE_URL: SQLite- of PostgreSQL-URL (standaard `sqlite:///./audit.db`).
- FILES_DIR: map waar PDF-rapporten worden opgeslagen.
- ADMIN_TOKEN: geheim token voor admin-requests.
- STRIPE_CHECKOUT_URL: vooraf aangemaakte Stripe-betaallink.
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM: SMTP-instellingen voor mails (of laat leeg om enkel te loggen).
- BASE_URL: publieke backend-URL voor downloadlinks in e-mails.

### Frontend (.env.local)
- NEXT_PUBLIC_API_BASE: URL van de backend-API (bv. Render-URL of `http://localhost:8000`).
- NEXT_PUBLIC_LOGO_TEXT: tekst voor de branding in de header.
- NEXT_PUBLIC_CONTACT_EMAIL: e-mailadres dat op de landingspagina wordt getoond.
- NEXT_PUBLIC_SOCIAL_TW / NEXT_PUBLIC_SOCIAL_LI: links naar Twitter/X en LinkedIn profielen.

## Deployment

Volg voor een gedetailleerde walkthrough de gids in [`docs/DEPLOYMENT_PREP.md`](docs/DEPLOYMENT_PREP.md). De belangrijkste punten in het kort:

- Backend op Render:
  - Startcommand: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - Vul de env-keys uit `backend/.env.example` in en zorg dat `FILES_DIR` wijst naar een persistente disk (bv. `/data/files`).
  - Zet `CORS_ORIGINS` op het Vercel-domein van je frontend.

- Frontend op Vercel:
  - Zet `NEXT_PUBLIC_API_BASE` op de Render-backend-URL.
  - Build command: `next build`, output: `.next` (standaard).

## Go-live checklist
- Vul zowel `backend/.env` als `frontend/.env.local` in met productie-URL's en -tokens (ADMIN_TOKEN, STRIPE_CHECKOUT_URL, SMTP_*).
- Maak een persistente schijf aan voor `FILES_DIR` zodat geüploade PDF-rapporten behouden blijven na herstarten.
- Controleer CORS: zet `CORS_ORIGINS` op je Vercel-domein zodat de frontend requests mag doen.
- Test lokaal voor de deploy:
  - `python -m compileall backend`
  - `npm run lint` en `npm run build` in `frontend/`
- Start de backend met `uvicorn main:app --host 0.0.0.0 --port $PORT` en valideer dat `/requests/stripe-checkout` een URL teruggeeft.
- Check de nieuwe health-endpoint op `/health` om te bevestigen dat database, file-storage en configuratie klaarstaan.

## Notes
- Payment verification is simplified: payment status can be toggled in admin after Stripe checkout.
- File download links are tokenized per request.
