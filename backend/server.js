// Usman Kalera portfolio backend — contact-form API + message dashboard
// Storage: Postgres (Neon) when DATABASE_URL is set, JSON files as fallback.
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me-in-production';
const DATA_FILE = path.join(__dirname, 'messages.json');
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
const VISITS_FILE = path.join(__dirname, 'visits.json');

const useDb = !!process.env.DATABASE_URL;
let pool = null;

async function initDb() {
  if (!useDb) return;
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await pool.query(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, name TEXT, email TEXT, subject TEXT, message TEXT,
    ip TEXT, created_at TIMESTAMPTZ, read BOOLEAN DEFAULT FALSE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY, name TEXT, rating INT, comment TEXT, created_at TIMESTAMPTZ)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS visits (id INT PRIMARY KEY, count BIGINT)`);
  await pool.query(`INSERT INTO visits (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING`);
  console.log('Postgres storage ready');
}

// ---------- storage layer (DB primary, JSON fallback) ----------
async function loadMessages() {
  if (useDb) {
    const r = await pool.query('SELECT id,name,email,subject,message,created_at AS "createdAt",read FROM messages ORDER BY created_at DESC');
    return r.rows;
  }
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}
async function saveMessage(m) {
  if (useDb) {
    await pool.query('INSERT INTO messages (id,name,email,subject,message,ip,created_at,read) VALUES ($1,$2,$3,$4,$5,$6,$7,FALSE)',
      [m.id, m.name, m.email, m.subject, m.message, m.ip, m.createdAt]);
    return;
  }
  const msgs = await loadMessages(); msgs.unshift(m);
  fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2));
}
async function markRead(id) {
  if (useDb) { await pool.query('UPDATE messages SET read=TRUE WHERE id=$1', [id]); return; }
  const msgs = await loadMessages();
  const m = msgs.find(x => x.id === id);
  if (m) { m.read = true; fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2)); }
  return !!m;
}
async function loadReviews() {
  if (useDb) {
    const r = await pool.query('SELECT id,name,rating,comment,created_at AS "createdAt" FROM reviews ORDER BY created_at DESC');
    return r.rows;
  }
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8')); } catch { return []; }
}
async function saveReview(rv) {
  if (useDb) {
    await pool.query('INSERT INTO reviews (id,name,rating,comment,created_at) VALUES ($1,$2,$3,$4,$5)',
      [rv.id, rv.name, rv.rating, rv.comment, rv.createdAt]);
    return;
  }
  const revs = await loadReviews(); revs.unshift(rv);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(revs, null, 2));
}
async function deleteReview(id) {
  if (useDb) { await pool.query('DELETE FROM reviews WHERE id=$1', [id]); return; }
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify((await loadReviews()).filter(r => r.id !== id), null, 2));
}
async function getVisits() {
  if (useDb) {
    const r = await pool.query('SELECT count FROM visits WHERE id=1');
    return Number(r.rows[0].count);
  }
  try { return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8')).count || 0; } catch { return 0; }
}
async function bumpVisits() {
  if (useDb) {
    const r = await pool.query('UPDATE visits SET count = count + 1 WHERE id=1 RETURNING count');
    return Number(r.rows[0].count);
  }
  const count = await getVisits() + 1;
  fs.writeFileSync(VISITS_FILE, JSON.stringify({ count }));
  return count;
}

app.use(express.json({ limit: '32kb' }));

// v51: wrap async handlers so rejections reach the error handler (Express 4
// does not catch async errors by itself — an unhandled one hangs the request)
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// CORS — allow only the portfolio origin (plus local dev). Non-browser
// clients (health checks, the keep-warm ping) send no Origin and are
// unaffected; browsers from any other origin get no CORS grant.
const ALLOWED_ORIGINS = ['https://usmankalera-dev.github.io', 'http://localhost:8000', 'http://127.0.0.1:8000', 'http://127.0.0.1:8901'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  // v51: basic security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Referrer-Policy', 'no-referrer');
  res.header('X-Frame-Options', 'DENY');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Simple in-memory rate limit: 5 submissions / 10 min per IP
// v1.1.1: key on the real client IP — the first X-Forwarded-For hop —
// not the whole header string (later hops can vary behind proxies)
function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  const first = xff ? String(xff).split(',')[0].trim() : '';
  return first || req.socket.remoteAddress || 'unknown';
}
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

app.get('/api/health', wrap(async (req, res) =>
  res.json({ ok: true, version: '1.1.1', storage: useDb ? 'postgres' : 'json', time: new Date().toISOString() })));

// Contact form submission
app.post('/api/contact', wrap(async (req, res) => {
  const ip = clientIp(req);
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many messages — please try again later.' });

  let { name, email, subject, message } = req.body || {};
  name = String(name || '').trim().slice(0, 80);
  email = String(email || '').trim().slice(0, 120);
  subject = String(subject || '').trim().slice(0, 120);
  message = String(message || '').trim().slice(0, 2000);

  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'All fields are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' });

  await saveMessage({
    id: crypto.randomUUID(), name, email, subject, message,
    ip: String(ip).slice(0, 45), createdAt: new Date().toISOString(), read: false
  });
  res.json({ ok: true });
}));

// Reviews — public list
app.get('/api/reviews', wrap(async (req, res) => res.json(await loadReviews())));

// Visitor counter
app.get('/api/visits', wrap(async (req, res) => res.json({ count: await getVisits() })));
app.post('/api/visits', wrap(async (req, res) => res.json({ count: await bumpVisits() })));

// Reviews — submit (rate-limited)
app.post('/api/reviews', wrap(async (req, res) => {
  const ip = clientIp(req);
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many submissions — please try again later.' });

  let { name, rating, comment } = req.body || {};
  name = String(name || '').trim().slice(0, 80);
  comment = String(comment || '').trim().slice(0, 500);
  rating = parseInt(rating, 10);

  if (!name || !comment) return res.status(400).json({ error: 'Name and review are required.' });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be 1–5 stars.' });

  await saveReview({ id: crypto.randomUUID(), name, rating, comment, createdAt: new Date().toISOString() });
  res.json({ ok: true });
}));

// Reviews — admin delete
app.delete('/api/reviews/:id', wrap(async (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  await deleteReview(req.params.id);
  res.json({ ok: true });
}));

// Admin: list messages (Bearer token)
app.get('/api/messages', wrap(async (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  res.json(await loadMessages());
}));

// Admin: mark read
app.post('/api/messages/:id/read', wrap(async (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  const ok = await markRead(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}));

// Tiny admin dashboard (open /admin in browser, paste token)
app.get('/admin', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Inbox — Usman Kalera</title>
<style>body{font-family:sans-serif;background:#0d0d0f;color:#f2ede4;max-width:800px;margin:0 auto;padding:24px}
input,button{padding:10px;font-size:1rem}input{width:70%;background:#1a1a1f;border:1px solid #2a2a30;color:#fff;border-radius:8px}
button{background:#f5a623;border:none;border-radius:8px;font-weight:700;cursor:pointer}
.msg{background:#1a1a1f;border:1px solid #2a2a30;border-radius:10px;padding:14px;margin:12px 0}
.msg.unread{border-left:4px solid #f5a623}.meta{color:#a8a29a;font-size:.8rem}</style></head>
<body><h2>📥 Inbox</h2>
<input id="t" type="password" placeholder="Admin token"> <button onclick="load()">Load</button>
<h3>Messages</h3><div id="list"></div>
<h3>Reviews</h3><div id="revs"></div>
<script>async function load(){const t=document.getElementById('t').value;
const r=await fetch('/api/messages',{headers:{Authorization:'Bearer '+t}});const d=await r.json();
if(!Array.isArray(d)){document.getElementById('list').innerHTML='<p>Unauthorized</p>';return;}
document.getElementById('list').innerHTML=d.map(m=>'<div class="msg'+(m.read?'':' unread')+'"><b>'+m.name+'</b> <span class="meta">'+m.email+' · '+m.createdAt+'</span><p><b>'+m.subject+'</b></p><p>'+m.message.replace(/</g,'&lt;')+'</p></div>').join('')||'<p>No messages yet.</p>';
const r2=await fetch('/api/reviews');const revs=await r2.json();
document.getElementById('revs').innerHTML=revs.map(v=>'<div class="msg"><b>'+v.name.replace(/</g,'&lt;')+'</b> <span class="meta">'+'★'.repeat(v.rating)+' · '+v.createdAt+'</span><p>'+v.comment.replace(/</g,'&lt;')+'</p><button onclick="delRev(\\''+v.id+'\\')">Delete</button></div>').join('')||'<p>No reviews yet.</p>';
window._t=t;}
async function delRev(id){await fetch('/api/reviews/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+window._t}});load();}</script>
</body></html>`);
});

// v1.1.1: central error handler — respects the error's own status (a body
// parser rejection is a client error: 413 too large / 400 malformed JSON),
// never leaks internals, never hangs
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('API error:', err && err.message);
  if (res.headersSent) return next(err);
  const msg = status === 413 ? 'Request too large.'
    : status >= 500 ? 'Server error — please try again.'
    : 'Bad request.';
  res.status(status).json({ error: msg });
});

initDb().then(() => {
  app.listen(PORT, () => console.log('Portfolio API listening on port ' + PORT + ' (storage: ' + (useDb ? 'postgres' : 'json') + ')'));
}).catch(err => {
  console.error('DB init failed, exiting:', err.message);
  process.exit(1);
});
