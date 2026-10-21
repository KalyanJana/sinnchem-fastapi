# Sinnchem API

FastAPI backend for business enquiries and career applications. Submissions are
validated, formatted as HTML and plain-text email, then dispatched to the
configured recipient with an optional CV attachment. Personal data and CVs are
not persisted by this service.

## Setup

From the repository root, create and activate a virtual environment, then
install the backend runtime and development dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements-dev.txt
```

Set the SMTP values in `backend/.env`. Never commit that file. The backend reads
`MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, and
`MAIL_FROM_NAME`; `MAIL_FROM` defaults to `MAIL_USERNAME`. `MAIL_TO` is the
Sinnchem inbox for submission notifications and defaults to `info@sinnchem.com`.
Each submission also receives a confirmation at the email address provided in
the form. Use SMTP credentials issued by the mailbox or email provider. For SSL
SMTP use port 465 with `MAIL_USE_STARTTLS=false`; for STARTTLS use the provider's
submission port, commonly 587. `MAIL_HOST` remains supported as an alias for
`MAIL_SERVER`.

The app loads `backend/.env` automatically and then reads environment variables
from the process. Process environment values take precedence over values in the
file. Secrets must not be added to source code.

## Run

Run from the `backend` directory so the `app` package is importable:

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/health`

Interactive API documentation in development: `http://localhost:8000/docs`
API docs are disabled when `APP_ENV=production`.

Run the frontend with `npm run dev` from `frontend/`; Vite proxies `/api` and
`/health` to `http://localhost:8000`. For a deployed frontend, set
`VITE_API_URL` to the API base URL, including `/api`.

## Endpoints

- `POST /api/contact`: JSON business enquiry. Responds `202` with a reference ID.
- `POST /api/careers`: multipart candidate application with a required PDF, DOC,
  or DOCX CV up to 5 MB. Responds `202` with a reference ID.
- `GET /health`: basic process health check.

Missing SMTP configuration returns `503`, so the API does not tell the browser a
message was accepted when delivery cannot be attempted. SMTP send failures after
acceptance are logged server-side; logs omit submitted fields and credentials.

## Tests

The dev requirements include the production requirements plus pytest and httpx.
From the repository root:

```powershell
..\.venv\Scripts\python.exe -m pytest backend\tests -q
```

Tests mock SMTP and never contact a real mail server. Real delivery requires
valid provider-issued SMTP credentials and should be smoke-tested in a
controlled environment.

## Delivery model

FastAPI `BackgroundTasks` runs the SMTP send after the response in the same
application process. It avoids delaying the response on SMTP, but it is not a
durable queue: a process crash can lose an accepted task. Use a separate worker
and durable broker if delivery guarantees or retries become a requirement.

## Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render setup, required environment
variables, production commands, and health checks. A root `render.yaml`
Blueprint is included. Production installs `backend/requirements.txt` only;
pytest and httpx are kept in `backend/requirements-dev.txt`.