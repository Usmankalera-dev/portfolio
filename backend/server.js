// Usman Kalera portfolio backend — contact-form API + message dashboard
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me-in-production';
const DATA_FILE = path.join(__dirname, 'messages.json');
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

app.use(express.json({ limit: '32kb' }));

// CORS — allow the GitHub Pages frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Simple in-memory rate limit: 5 messages / 10 min per IP
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

function loadMessages() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function saveMessages(msgs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2));
}
function loadReviews() {
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8')); }
  catch { return []; }
}
function saveReviews(revs) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(revs, null, 2));
}

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Contact form submission
app.post('/api/contact', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
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

  const msgs = loadMessages();
  msgs.unshift({
    id: crypto.randomUUID(),
    name, email, subject, message,
    ip: String(ip).slice(0, 45),
    createdAt: new Date().toISOString(),
    read: false
  });
  saveMessages(msgs);
  res.json({ ok: true });
});

// Reviews — public list
app.get('/api/reviews', (req, res) => res.json(loadReviews()));

// Visitor counter
const VISITS_FILE = path.join(__dirname, 'visits.json');
function getVisits() {
  try { return JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8')).count || 0; }
  catch { return 0; }
}
app.get('/api/visits', (req, res) => res.json({ count: getVisits() }));
app.post('/api/visits', (req, res) => {
  const count = getVisits() + 1;
  fs.writeFileSync(VISITS_FILE, JSON.stringify({ count }));
  res.json({ count });
});

// Reviews — submit (rate-limited)
app.post('/api/reviews', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many submissions — please try again later.' });

  let { name, rating, comment } = req.body || {};
  name = String(name || '').trim().slice(0, 80);
  comment = String(comment || '').trim().slice(0, 500);
  rating = parseInt(rating, 10);

  if (!name || !comment) return res.status(400).json({ error: 'Name and review are required.' });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be 1–5 stars.' });

  const revs = loadReviews();
  revs.unshift({ id: crypto.randomUUID(), name, rating, comment, createdAt: new Date().toISOString() });
  saveReviews(revs);
  res.json({ ok: true });
});

// Reviews — admin delete
app.delete('/api/reviews/:id', (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  saveReviews(loadReviews().filter(r => r.id !== req.params.id));
  res.json({ ok: true });
});

// Admin: list messages (Bearer token)
app.get('/api/messages', (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  res.json(loadMessages());
});

// Admin: mark read
app.post('/api/messages/:id/read', (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  const msgs = loadMessages();
  const m = msgs.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Not found' });
  m.read = true;
  saveMessages(msgs);
  res.json({ ok: true });
});

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

app.listen(PORT, () => console.log('Portfolio API listening on port ' + PORT));
