# Deployment guide

This file explains how to deploy the project to a Node-friendly host (Render or Railway).

## Requirements
- Node.js 18+ (the `engines` field in `package.json` already requires >=18)
- The repository should **not** contain secrets — use platform environment variables.

## Environment variables
Set these environment variables on your host service:

- `ADMIN_PASSWORD` — password for `/admin` (choose a strong secret).
- `SESSION_SECRET` — long random string used to sign sessions.
- `PORT` — optional; most hosts provide this automatically.

The repo includes `.env.example` as a template. Locally you can copy it to `.env` (already ignored by `.gitignore`).

## Render
1. Create a new Web Service and connect your GitHub repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add the environment variables `ADMIN_PASSWORD` and `SESSION_SECRET` in the Render dashboard.
5. Deploy. The service URL serves both the public site and the admin dashboard at `/admin`.

Notes for Render:
- Use the free or hobby plan for small sites. Render will set `PORT` automatically.
- The app stores appointments in `data/appointments.json` — this file is local to the instance. For production reliability, use a real database or external storage if you expect multiple instances or persistent retention.

## Railway
1. Create a new project and connect your repo.
2. Set the build command to `npm install` and start command to `npm start`.
3. Add `ADMIN_PASSWORD` and `SESSION_SECRET` under Environment variables.
4. Deploy — Railway will provide a URL for the service.

## Quick local deploy steps (for testing)
```powershell
cd dental-clinic
npm install
copy .env.example .env
# edit .env to set ADMIN_PASSWORD and SESSION_SECRET
npm start
```

## Testing after deploy
- Visit the root URL for the public site.
- Visit `/admin` and sign in with `ADMIN_PASSWORD` set in the environment.
- Submitting the appointment form (`POST /api/appointments`) will append to `data/appointments.json` on that instance.

## Security & maintenance notes
- Do NOT commit `.env` to the repo. `.gitignore` already includes `.env`.
- Use a long, random `SESSION_SECRET` (at least 32 characters).
- Consider replacing local file storage with a DB (Postgres, SQLite on a mounted volume, or a hosted DB) before production for reliability.

If you want, I can create a small `render.yaml` (or Railway configuration) and a short README section linking to this file.
