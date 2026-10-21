# Backend Deployment

Production API deployment instructions for Render. The root Render Blueprint
creates both the API and frontend services; the frontend origin must be listed
in `CORS_ORIGINS`.

## Render Blueprint

The repository-root `render.yaml` describes both services. In Render, create a
Blueprint from the GitHub repository. After Render assigns the frontend URL,
set `CORS_ORIGINS` to that exact origin, without a trailing slash. If using a
custom domain, include it too, comma-separated.

Required private SMTP values are `MAIL_SERVER`, `MAIL_USERNAME`,
`MAIL_PASSWORD`, and `MAIL_FROM`. For Gmail, use `smtp.gmail.com`, port `587`,
STARTTLS enabled, and an account App Password where required. Never commit real
credentials or put them in the frontend environment.

The local `backend/.env` is ignored by Git. Copy its values into the Render API
service's Environment settings; do not push the local file to GitHub. The
frontend has no local `.env`; its Render build variable is configured on the
static site service.

Render installs `backend/requirements.txt` and runs:

```sh
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Render uses `/health` for its health check. After deployment, verify
`https://YOUR-API.onrender.com/health` returns `{"status":"ok"}`.

## Manual Render Setup

If not using the Blueprint, create a Python web service with:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health`

Set the same environment variables listed in `render.yaml` in the Render
dashboard. Do not set a fixed port; Render supplies `$PORT`.

## Local Tests

Install test tools separately from production dependencies:

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

Production installs only `requirements.txt`; it intentionally excludes pytest
and httpx.

## Delivery Limitations

Submissions are sent through FastAPI `BackgroundTasks` and are not stored. A
`202` means the request was accepted for processing; background SMTP failure is
logged and is not durably retried. Add a persistent job queue and monitoring
before relying on guaranteed delivery. Configure SMTP provider limits and
attachment policies before launch.