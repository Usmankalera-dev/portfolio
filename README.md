# Usman Kalera — Portfolio

Personal portfolio of **Usman Kalera**, Founder & CEO of Rakhzaar Tech, BS Artificial Intelligence student at Superior University Lahore.

**Live:** https://usmankalera-dev.github.io/portfolio/
**Backend API:** https://portfolio-nu8s.onrender.com (`/api/health` reports the running version)

## Architecture

```
Browser ──► GitHub Pages (this repo, root)     static site — CDN, traffic-proof
              index.html / styles.css / app.js / anim.js / bg3d.js / sw.js
              │
              └──► Render free web service (backend/server.js, Express)
                     ├── Neon Postgres (primary store, DATABASE_URL)
                     ├── JSON files (automatic fallback store)
                     └── Admin inbox at /admin (Bearer-token protected)
```

- The **site never depends on the backend to render**: reviews and the visitor
  counter paint instantly from a `localStorage` cache and refresh when the API
  answers (the free-tier backend sleeps when idle; a keep-warm ping every
  10 minutes keeps it awake).
- If the contact API is unreachable, the form offers a prefilled **WhatsApp**
  fallback so a lead is never lost.

## Frontend files

| File | Purpose |
|---|---|
| `index.html` | All sections; EN/UR i18n keys live in `app.js` (every key must exist in both languages) |
| `styles.css` | Theme (dark/light via `data-theme`), layout, v49 animation system |
| `app.js` | i18n, theme, counters, reviews, contact form, scrollspy, drawer nav |
| `bg3d.js` | Three.js neural-network hero background (theme-aware, pauses off-screen) |
| `anim.js` | Staggered scroll reveals, animated skill bars, subtle card tilt |
| `sw.js` | Service worker — network-first HTML, cache-first static shell |

## Backend (`backend/server.js`, Express, Node ≥ 18)

Endpoints: `GET /api/health` · `GET|POST /api/reviews` · `GET|POST /api/visits` ·
`POST /api/contact` · admin: `GET /api/messages`, `POST /api/messages/:id/read`,
`DELETE /api/reviews/:id` (Bearer `ADMIN_TOKEN`), dashboard at `/admin`.

Guards: JSON body limit 32 KB, per-IP rate limit (5 submissions / 10 min),
field length caps + email/rating validation, parameterized SQL, CORS allowlist
(only the GitHub Pages origin + localhost), security headers, central error
handler (a storage failure returns 500 JSON, never a hang).

Env vars (Render): `DATABASE_URL` (Neon), `ADMIN_TOKEN`.

## Deploy rules (do not skip)

1. **Cache-bust on every frontend change:** bump `?v=NN` for any changed
   CSS/JS in `index.html` — phones cache aggressively.
2. **Bump the service-worker cache name** (`uk-portfolio-vNN` in `sw.js`)
   in the same deploy, or returning visitors keep the old shell.
3. Files deploy via GitHub **Add file → Upload files** with identical root
   filenames, committed straight to `main`. GitHub Pages republishes in
   ~1–2 minutes; Render redeploys the backend automatically on push.
4. **After every deploy, run `./smoke-test.sh`** and confirm all checks pass.
5. Never commit: the Google verification file and IndexNow key file must stay
   at the repo root; secrets (`ADMIN_TOKEN`, `DATABASE_URL`) live only in
   Render env vars — never in code or this README.

## Testing

- `./smoke-test.sh` — live checks: homepage markers, JS/CSS availability,
  backend health + reviews.
- Backend local run: `cd backend && npm install && PORT=3000 ADMIN_TOKEN=dev node server.js`
  (JSON fallback mode when `DATABASE_URL` is unset).

## Versioning

Frontend uses `vNN` (cache-bust + service-worker name); backend uses semver
in `backend/package.json` and reports it at `/api/health`. See `CHANGELOG.md`.

## Backups

The repo is the source of truth. Dated source snapshots are kept outside the
repo by the maintainer (frontend + backend, excluding `node_modules`).
Live data (messages, reviews, visits) lives in Neon Postgres.
