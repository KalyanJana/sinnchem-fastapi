# Sinnchem Website

React/Vite frontend and FastAPI backend for the Sinnchem product directory,
business enquiry form, and career application form.

## Repository Layout

- `frontend/`: React, TypeScript, and Vite application; deployed as a static site.
- `backend/`: FastAPI API and SMTP email delivery; deployed as a Python web service.
- `render.yaml`: Render Blueprint for the API.

The backend is Python, so it uses `requirements.txt` and a Uvicorn start command;
it does not need a `package.json`. The frontend uses `package.json` and
`package-lock.json` for its Node dependencies.

## Local Development

Backend, from the repository root in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements-dev.txt
Set-Location backend
python -m uvicorn app.main:app --reload --port 8000
```

Set valid SMTP values in your local `backend/.env` before submitting forms. Keep
that file out of Git. In another terminal, from `frontend/`:

```powershell
npm ci
npm run dev
```

Vite serves the frontend at `http://localhost:5173` and proxies API requests to
`http://localhost:8000`.

## Production Deployment

Recommended split deployment on Render:

1. Push this repository to GitHub. `.gitignore` excludes local secrets,
   dependency folders, build output, and local caches.
2. Create a Render Blueprint from the root `render.yaml`; it creates the API
   web service and frontend static site.
3. After Render assigns both service URLs, set frontend `VITE_API_URL` to
   `https://YOUR-API.onrender.com/api` and backend `CORS_ORIGINS` to the exact
   frontend origin. Set backend SMTP values in Render's service environment.
   Redeploy both services.
4. Add SMTP credentials only to the backend service's private Render
   environment settings. Never commit SMTP secrets or expose them to the
   frontend.

After setting deployment environment variables, trigger a frontend redeploy
because Vite embeds `VITE_API_URL` at build time. Check the API's `/health`
endpoint after deploy.

## Checks

```powershell
Set-Location frontend
npm ci
npm run build
Set-Location ..
..\.venv\Scripts\python.exe -m pytest backend\tests -q
```

See the folder-level deployment guides for provider-specific configuration and
important email-delivery limitations.