# Dr Pinto's Dento Facial Clinic — Website

A full website with a working appointment-booking backend for Dr Kunal Pinto's clinic in Santacruz West, Mumbai.

## What's included

- **Public site** (`/public`) — home, about, services, why-us, appointment booking form, and contact/map, with smooth scrolling and a responsive layout down to mobile.
- **Backend** (`server.js`) — a small Node/Express server that:
  - Accepts appointment requests from the booking form and saves them (`POST /api/appointments`)
  - Serves a password-protected admin dashboard to view, update, and delete requests
- **Admin dashboard** (`/admin`) — sign in, see every booking request, filter by status, mark as confirmed/completed/cancelled, or delete.

Appointment data is stored in `data/appointments.json` — no external database needed. This is fine for a single-location clinic's booking volume; it can be swapped for a real database later if needed.

## Important: this needs a Node.js host, not GitHub Pages

GitHub Pages only serves static files — it can't run the Express backend, so the booking form and admin dashboard won't work there. To keep the backend working, deploy to a Node-friendly host instead. Good free/cheap options:

- [Render](https://render.com) (free web service tier)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)

The steps are similar everywhere: connect your GitHub repo, set the **Start Command** to `npm start`, and add the environment variables below.

## Running it locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
cd dental-clinic
npm install
cp .env.example .env
```

Open `.env` and set your own values:

```
ADMIN_PASSWORD=choose-a-real-password
SESSION_SECRET=any-long-random-string
```

Then start the server:

```bash
npm start
```

- Website: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin/ (sign in with the `ADMIN_PASSWORD` you set)

## Deploying (example: Render)

1. Push this project to a GitHub repository.
2. On [render.com](https://render.com), create a **New Web Service** and connect that repo.
3. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Under **Environment**, add `ADMIN_PASSWORD` and `SESSION_SECRET` with real values (don't reuse the example ones).
5. Deploy. Render gives you a live URL — that's your website and `/admin/` dashboard both running from the same server.

## Editing the content

- **Services, hours, and page copy** — edit directly in `public/index.html`. The services list is a starting point based on common dental treatments; update it to match what the clinic actually offers.
- **Colors and fonts** — all defined as CSS variables at the top of `public/css/style.css` (`:root`), so the whole palette can be changed from one place.
- **Appointment form fields** — form is in `public/index.html` (`#appointmentForm`); the matching handling logic is in `server.js`.

## Managing bookings

Go to `/admin/`, sign in with the admin password, and you'll see every request submitted through the site: name, phone, email, treatment, preferred date/time, and any message — newest first. Each one can be marked Pending / Confirmed / Completed / Cancelled, or deleted.

## A note on security

This uses a single shared admin password rather than individual staff logins, which is enough for a small clinic team but worth knowing:
- Always set a real, private value for `ADMIN_PASSWORD` and `SESSION_SECRET` before deploying — never use the example values.
- Whoever has the password can see every patient's contact details and booking notes, so share it only with staff who need it.
