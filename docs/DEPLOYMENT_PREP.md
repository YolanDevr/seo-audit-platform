# Deploy-voorbereiding (Render + Vercel)
Deze gids leidt je stap-voor-stap door het klaarzetten van de backend (Render) en frontend (Vercel). Alles is in simpele blokken opgedeeld zodat je zonder veel voorkennis kunt volgen.

## 0) Wat je nodig hebt
- Een Render-account (gratis plan is genoeg voor test).
- Een Vercel-account.
- Een Stripe-betaallink (één link is voldoende; geen webhooks nodig).
- SMTP-gegevens (of laat leeg; dan worden mails gelogd in de backend-log).
- Tijdelijke admin-token naar keuze (gebruik later een sterke). 

## 1) Maak lokale env-bestanden
Voer in de root van het project:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```
Vul daarna de waarden in beide bestanden in. Belangrijk:
- `ADMIN_TOKEN`: kies nu al een sterke waarde (ditzelfde token gebruik je in de admin-UI).
- `STRIPE_CHECKOUT_URL`: plak je Stripe-betaallink.
- `FILES_DIR`: laat `./files` staan voor lokaal; op Render gebruiken we `/data/files` (komt verderop).
- `BASE_URL`: zet lokaal op `http://localhost:8000`; op Render wordt dit je live backend-URL.
- `NEXT_PUBLIC_API_BASE`: lokaal `http://localhost:8000`, op Vercel naar je Render-URL.

## 2) Lokale sanity-check (optioneel maar aangeraden)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
python -m compileall backend

cd frontend
npm install
npm run lint
npm run build
```
Deze drie checks (compileall, lint, build) zijn exact dezelfde die je vóór deploy kunt uitvoeren om te weten of alles goed staat.

## 3) Backend deployen op Render
Je kunt de meegeleverde `render.yaml` gebruiken (Render > New > Blueprint > link naar deze repo) of handmatig configureren.

Belangrijkste velden:
- **Root directory**: `backend`
- **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Persistent disk**: mount `/data` (minstens 1GB); zet `FILES_DIR` op `/data/files` en `DATABASE_URL` op `sqlite:////data/audit.db`.
- **CORS_ORIGINS**: stel in op je Vercel-domein (bv. `https://jouwdomein.vercel.app`).
- **BASE_URL**: je live Render-URL (Render kan dit automatisch invullen via `render.yaml`).
- **SMTP_***: vul je SMTP-gegevens in; laat leeg als je enkel logging wilt.

Na deploy:
1. Ga naar de Render-logs en zoek “Application startup complete”.
2. Check de health-endpoint:
   ```bash
   curl -s https://<jouw-render-url>/health
   ```
   - `status: ok` betekent dat database, files-dir, Stripe-link en admin-token klaarstaan.
   - Als `status: warn` is, lees de `checks`-details voor wat ontbreekt (bv. Stripe-link, admin-token of folderrechten).
3. Test de checkout-endpoint:
   ```bash
   curl -s https://<jouw-render-url>/requests/stripe-checkout
   ```
   Dit moet een geldige `checkout_url` teruggeven.
4. Test een download-link door in de admin (zie stap 5) een PDF te uploaden en een rapport-mail te versturen; de mail wordt gelogd als SMTP leeg is.

## 4) Frontend deployen op Vercel
1. Verbind de repo met Vercel en kies `frontend` als root.
2. Zet de build op `next build` (standaard) en laat de output `.next`.
3. Voeg env-vars toe:
   - `NEXT_PUBLIC_API_BASE`: jouw Render-URL.
   - `NEXT_PUBLIC_LOGO_TEXT`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SOCIAL_TW`, `NEXT_PUBLIC_SOCIAL_LI` naar wens.
4. Deploy. Na build kun je via het Vercel-domein de landing, aanvraagformulier en admin bereiken.

## 5) Post-deploy validatie (snelle checklist)
- Open de landing en doe een testaanvraag; je wordt doorgestuurd naar Stripe (of je ziet de Stripe-link als redirect).
- Open `/admin` op Vercel, vul je `ADMIN_TOKEN` in en:
  - Zet een aanvraag op “Paid” en “Audit done”.
  - Upload een test-PDF en klik “Send report”; controleer in Render-logs dat er een download-URL gelogd wordt.
- Download het rapport via de link in de mail/log; bevestig dat het bestand bestaat in `/data/files` op Render (Visible via “Shell” of “SSH” in Render dashboard).

## 6) Veelvoorkomende valkuilen
- **CORS**: 403/blocked? Voeg je Vercel-URL toe aan `CORS_ORIGINS` (comma-separate indien meerdere). 
- **SMTP**: geen mail ontvangen? Als SMTP leeg is, wordt er alleen gelogd. Vul de SMTP-velden en controleer dat poort en login kloppen.
- **Bestanden weg na restart**: controleer dat `FILES_DIR` wijst naar een persistente disk (`/data/files`), niet naar `/tmp` of project-root.
- **Stripe-link**: gebruik een “Payment link” (beta button) en niet een checkout-session-URL; de endpoint verwacht een statische link.

## 7) Onderhoudstips
- Bewaar `ADMIN_TOKEN` veilig en roteer periodiek.
- Maak regelmatig een backup van `/data/audit.db` en `/data/files` (Render disk). 
- Overweeg PostgreSQL i.p.v. SQLite zodra je meer verkeer of meerdere instances draait.
