# Integra Web

Single-page site for Asociacion Integra (Vite + React) with a serverless contact endpoint for Vercel.

## Local development

- Frontend (Vite):
  - `npm install`
  - `npm run dev`
- API (Vercel dev server):
  - `vercel dev`

The Vite dev server proxies `/api/*` to `http://localhost:3000` so the frontend can call the serverless function while `vercel dev` is running.

## Serverless API

The serverless endpoint lives at `api/send.js` and expects the following env vars:

- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `RESEND_FROM`
