# Changelog

All notable changes to the portfolio site. Frontend versions are the
cache-bust numbers used in `index.html` / `sw.js`; backend versions are
semver from `backend/package.json`.

## Backend 1.1.2 + Frontend v52 — 2026-10-20 (round-2 security fixes)
- **Rate-limit bypass fixed.** Round-2 tests proved the limiter could be
  dodged by rotating fake `X-Forwarded-For` values (it keyed on the
  client-supplied first hop). It now keys on the **last** hop — the one
  Render's edge appends. Verified locally: 6th rapid submission → 429
  even with varying fake first hops.
- **Clickjacking mitigation (v52–v53).** Round-2 tests framed the live
  site in a foreign page (GitHub Pages sends no `X-Frame-Options`).
  `app.js` now opens with a frame-buster that breaks out to the real
  address. Live retesting showed Chrome blocks the load-time attempt, so
  v53 also retries after page load — that attempt succeeds. Residual
  risk is low (public portfolio, no session).
- Round 2's other 18 checks passed: auth-bypass variants, NoSQLi,
  prototype pollution, XXE (edge-blocked), TRACE, old TLS, cookie audit,
  sensitive paths, CORS preflight attack, host-header injection, cache
  poisoning probe, type confusion.

## Backend 1.1.1 — 2026-10-20 (security fixes)
- Error handler now respects each error's own status: oversized bodies get
  **413** and malformed JSON gets **400** (both previously surfaced as 500).
  Found by the 20-point security test run the same day.
- Rate limiter keys on the real client IP (first `X-Forwarded-For` hop)
  instead of the whole header string, so proxy-hop variance can no longer
  split one visitor into several rate-limit buckets. Verified locally:
  6th rapid submission returns 429.
- The same run's other findings needed no code change: backend source is
  visible only because this repo is public (no secrets in code — verified
  by scan), and all 17 remaining checks passed (HTTPS/HSTS, CORS, admin
  auth, SQLi/XSS probes stored harmlessly, traversal and `.git` blocked).

## v51 — 2026-10-20 (SE hardening)
- Added the missing favicon (SVG + PNG + apple-touch-icon).
- Backend 1.1.0: async error handling on all routes + central error handler
  (no more hung requests on a storage failure), CORS tightened from `*` to
  an allowlist (portfolio origin + localhost), security headers
  (`nosniff`, `Referrer-Policy`, `X-Frame-Options`), `/api/health` now
  reports the backend version. Fully tested locally before deploy.
- Repo documentation: this changelog, a full `README.md` (architecture,
  deploy rules, testing), and `smoke-test.sh` for post-deploy checks.
- Service-worker cache bumped to `uk-portfolio-v51`.

## v50 — 2026-10-20 (resilience)
- Timed fetches everywhere (no element can hang on a sleeping backend),
  backend warm-up ping on page load, `preconnect` to the API origin.
- Reviews and visitor counter render instantly from a localStorage cache
  and refresh in the background.
- Contact form falls back to a prefilled WhatsApp message if the API is
  unreachable — leads are never lost.
- Service worker added: network-first HTML, cache-first static shell.
- Keep-warm hook pings `/api/visits` every 10 minutes so the free-tier
  backend does not idle-sleep.

## v49 — 2026-10-20 (premium animations)
- Staggered per-element scroll reveals (replacing the coarse section fade),
  skill bars animate 0 → target %, subtle 3D tilt + amber glow on card
  hover, button shine sweep, scrolling keyword marquee under the hero.
  All effects respect `prefers-reduced-motion`.

## v48 — 2026-10-20 (3D hero)
- Three.js neural-network background in the hero: glowing amber nodes and
  connecting lines, slow rotation, mouse parallax; theme-aware, pauses
  off-screen and for reduced-motion users, reduced node count on mobile.

## v47 — 2026-10-18
- Real project cards (Traffic Violation Detection, Face Mapping Lab,
  SeekhoWebDev, SajjadTrans.com), Ventures section, three featured
  5-star client testimonials.

## v43–v46 — 2026-10-17/18
- Repositioned as Founder & CEO, Rakhzaar Tech (vision section, updated
  hero stats). Animated mobile drawer navigation. Modern footer with
  CTA card and 4-column grid.

## 2026-10-16 — initial launch
- Static site on GitHub Pages + Express backend on Render (Neon Postgres
  with JSON fallback), contact form with admin inbox, reviews, visitor
  counter, EN/UR i18n, dark/light themes, SEO (sitemap, OG/JSON-LD,
  Search Console + Bing verification).
