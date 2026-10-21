# Frontend Deployment

Production frontend deployment instructions for Render. The site is a Vite
single-page application and calls the separately hosted FastAPI service.

## Render Blueprint

The repository-root `render.yaml` defines both the API and this static site.
Create a Blueprint from the repository in Render and let both services
provision. Then open the two services' Environment settings and set:

- Frontend: `VITE_API_URL=https://YOUR-API.onrender.com/api`
- Backend: `CORS_ORIGINS=https://YOUR-FRONTEND.onrender.com`

Use the actual service URLs assigned by Render. `VITE_API_URL` must end in
`/api`; `CORS_ORIGINS` must be the frontend origin only, with no trailing slash.
Add a custom domain to `CORS_ORIGINS` too if you use one. Blueprint values
marked `sync: false` are intentionally configured in Render rather than stored
in Git. Once both URLs are set, redeploy both services.

`VITE_API_URL` is public build-time configuration, not a secret. Never put SMTP
credentials, API keys, or other private values in frontend environment
variables or client code.

After setting or changing `VITE_API_URL`, redeploy the static site because Vite
embeds this value into the built JavaScript.

## Local Development

From `frontend/`:

```powershell
npm ci
npm run dev
```

The local Vite server proxies `/api` and `/health` to `http://localhost:8000`,
so the frontend does not need a local `.env` file.

## Verify Before Deploy

```powershell
npm ci
npm run build
```

The build output is generated in `dist/`; do not commit that generated folder.