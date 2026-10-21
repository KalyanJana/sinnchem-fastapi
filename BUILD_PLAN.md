# Sinnchem React + FastAPI Build Plan

This checklist is the persistent source of truth for build progress. Keep completed items checked and resume at the first unchecked item.

## Decisions and gates

- [x] Package installation approved for the frontend and backend dependencies listed below.
- [x] Use FastAPI `BackgroundTasks` + SMTP for the initial build. It starts email delivery after the response, but is not a durable queue if the process exits.
- [x] Add environment-based SMTP configuration and a backend-local `.env` loader; actual provider credentials still need to be supplied by Sinnchem.
- [x] Keep vacancy copy labeled as illustrative until Sinnchem confirms real openings.
- [x] Keep the current `index.html` prototype unchanged as the design reference.

## Proposed structure

```text
frontend/
  src/
    app/                 Redux store and typed hooks
    components/          Shared header, navigation, buttons, form controls
    features/            Home, products, company, careers, contact, enquiries
    services/            RTK Query API base and endpoint definitions
    styles/              Tokens, responsive styles, global CSS
    types/               Shared frontend API types
backend/
  app/
    api/                 Contact and career submission routes
    core/                Settings, validation, logging
    schemas/             Pydantic request/response schemas
    services/            Email composition and SMTP delivery
    main.py              FastAPI app and CORS setup
  tests/
```

## Build steps

### 1. Foundation

- [x] Create `frontend/` with React, TypeScript, Vite, Redux Toolkit, and RTK Query.
- [x] Create `backend/` directories, dependency declarations, environment example, and ignore rules. Backend implementation and tests are still pending.
- [x] Add backend setup documentation for SMTP, environment configuration, endpoints, tests, and run commands (`backend/README.md`).

### 2. Frontend

- [x] Port current visual language and responsive layouts from the prototype.
- [x] Implement responsive navigation and direct click-to-call action.
- [x] Implement Home, Products, Product Detail, About, Careers, Contact, and enquiry views.
- [x] Add RTK Query endpoints for contact and career form submissions.
- [x] Add loading, success, validation, and API error states to the forms.
- [ ] Run frontend typecheck/build and fix any integration errors.

### 3. Backend and email

- [x] Add typed contact and career submission endpoints with server-side validation.
- [x] Add CV upload validation (PDF/DOC/DOCX, size limit) and safe attachment naming.
- [x] Format separate business enquiry and career application emails to the configured recipient (default `info@sinnchem.com`).
- [x] Dispatch SMTP sends with FastAPI `BackgroundTasks`; return an accepted response without blocking on SMTP.
- [x] Do not persist personal data or CVs unless the owner explicitly requests storage.

### 4. Verification and handoff

- [x] Test backend routes and validation, including invalid/oversized uploads (15 passed).
- [ ] Exercise responsive routes/forms after successful builds.
- [x] Verify SMTP configuration failures are rejected and SMTP send failures are logged without exposing credentials (mocked SMTP tests).
- [x] Document that real email delivery requires valid SMTP environment values.
- [ ] Report completed checklist items and any owner-provided configuration still required.

## Package approval request

Frontend: `react`, `react-dom`, `vite`, `typescript`, `@vitejs/plugin-react`, `@reduxjs/toolkit`, `react-redux`, and type packages used by the TypeScript template.

Backend: `fastapi`, `uvicorn[standard]`, `python-multipart`, and test-only `pytest` plus `httpx`.

Email uses Python's standard library (`smtplib` and `email`); no third-party email package or queue package is proposed for the initial build.