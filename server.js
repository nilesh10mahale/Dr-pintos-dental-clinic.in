require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-only-secret-change-me';

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

// ---------- data helpers ----------
async function readAppointments() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAppointments(list) {
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function isValidAppointment(body) {
  return (
    typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    typeof body.phone === 'string' &&
    body.phone.trim().length >= 7 &&
    typeof body.service === 'string' &&
    body.service.trim().length > 0
  );
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ error: 'Not signed in.' });
}

// ---------- public API ----------

// Submit a new appointment request
app.post('/api/appointments', async (req, res) => {
  const body = req.body || {};

  if (!isValidAppointment(body)) {
    return res.status(400).json({ error: 'Please fill in your name, phone number, and the treatment you need.' });
  }

  const appointment = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: (body.email || '').trim(),
    service: body.service.trim(),
    preferredDate: (body.preferredDate || '').trim(),
    preferredTime: (body.preferredTime || '').trim(),
    message: (body.message || '').trim(),
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  const list = await readAppointments();
  list.unshift(appointment);
  await writeAppointments(list);

  res.status(201).json({ ok: true, message: 'Appointment request received.' });
});

// ---------- admin auth ----------

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password === 'string' && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'That password is incorrect.' });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/admin/session', (req, res) => {
  res.json({ isAdmin: Boolean(req.session && req.session.isAdmin) });
});

// ---------- admin API (protected) ----------

app.get('/api/appointments', requireAdmin, async (req, res) => {
  const list = await readAppointments();
  res.json(list);
});

app.patch('/api/appointments/:id', requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  const list = await readAppointments();
  const idx = list.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found.' });
  list[idx].status = status;
  await writeAppointments(list);
  res.json({ ok: true, appointment: list[idx] });
});

app.delete('/api/appointments/:id', requireAdmin, async (req, res) => {
  const list = await readAppointments();
  const next = list.filter((a) => a.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: 'Appointment not found.' });
  await writeAppointments(next);
  res.json({ ok: true });
});

// ---------- static files ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Fallback to the main site for unknown routes (keeps deep-links working)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dr Pinto's Dento Facial Clinic site running at http://localhost:${PORT}`);
});
