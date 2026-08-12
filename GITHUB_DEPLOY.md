# Deploying from GitHub (Render / Railway)

This document shows how to push the project to a GitHub repository and connect it to Render (recommended) or Railway so the full Node/Express app runs (not just the static frontend).

1) Create a GitHub repo and push

```bash
cd /path/to/dental-clinic
git init
git add .
git commit -m "Initial commit — dental clinic site"
# create a repo on GitHub and add the remote, or use GitHub CLI:
gh repo create my-org/dr-pintos-dental-clinic --public --source=. --remote=origin --push
# OR manually:
# git remote add origin https://github.com/USERNAME/REPO.git
# git branch -M main
# git push -u origin main
```

Notes:
- `.env` is ignored by `.gitignore` — do NOT commit secrets.
- If you used the sample `.env` locally, replace it with real secrets in the host dashboard (see below).

2) Connect the repo to Render (recommended for full app)

- Go to https://render.com and sign in.
- Create a **New Web Service** → **Connect a repository** → select your GitHub repo.
- Settings:
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Environment:** `Node` (Render will detect Node.js)
- Under Environment Variables (or Settings), add:
  - `ADMIN_PASSWORD` — set a strong secret
  - `SESSION_SECRET` — long random string (>=32 chars)
- Deploy. The rendered service URL will serve both the public site and the admin UI at `/admin`.

3) Connect the repo to Railway (alternative)

- Go to https://railway.app and create a new project, connect your GitHub repo.
- Set the build/start commands as above and add `ADMIN_PASSWORD` and `SESSION_SECRET` in Railway's environment settings.

4) Optional: use `render.yaml` to configure Render from your repo

If you'd like, I can add a `render.yaml` that defines the web service so Render can auto-deploy on push. That file should NOT include secret values — set them in the Render dashboard.

5) Testing after deployment

- Visit your service URL for the public site.
- Visit `https://<your-service>/admin` and sign in using the `ADMIN_PASSWORD` you set on Render/Railway.
- Submit an appointment using the form and confirm the `data/appointments.json` file on the host (note: the file is instance-local).

6) If you only want static hosting on GitHub Pages

- If you don't need the backend, publish the `public/` folder to GitHub Pages (we can add a workflow for that). The admin API and appointment form will not work when hosted this way.

If you'd like, I can:
- create `render.yaml` in the repo, or
- create a GitHub Actions workflow that publishes `public/` to `gh-pages`, or
- help you create the GitHub repo and push from this machine (you'll need to provide credentials or use `gh auth login`).
