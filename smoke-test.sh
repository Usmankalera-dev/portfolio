#!/usr/bin/env bash
# Portfolio smoke test — run after every deploy. Exits non-zero on any FAIL.
# Usage: ./smoke-test.sh
set -u
SITE="https://usmankalera-dev.github.io/portfolio"
API="https://portfolio-nu8s.onrender.com"
fail=0

chk() { # name url pattern
  if curl -s --max-time 40 "$2" | grep -q "$3"; then
    echo "PASS  $1"
  else
    echo "FAIL  $1"; fail=1
  fi
}
code() { curl -s -o /dev/null -w "%{http_code}" --max-time 40 "$1"; }

echo "== Frontend (GitHub Pages) =="
chk "homepage serves 3D hero canvas" "$SITE/" 'id="ai-bg"'
chk "homepage references service worker" "$SITE/" 'serviceWorker'
chk "homepage has favicon" "$SITE/" 'rel="icon"'
for f in styles.css app.js anim.js bg3d.js sw.js; do
  c=$(code "$SITE/$f")
  if [ "$c" = "200" ]; then echo "PASS  $f reachable (200)"; else echo "FAIL  $f ($c)"; fail=1; fi
done

echo "== Backend (Render) =="
chk "health endpoint ok" "$API/api/health" '"ok":true'
chk "health reports a version" "$API/api/health" '"version"'
chk "reviews endpoint returns a list" "$API/api/reviews" '^\['
chk "visits endpoint returns a count" "$API/api/visits" '"count"'

if [ "$fail" = "0" ]; then echo "ALL CHECKS PASSED"; else echo "SOME CHECKS FAILED"; fi
exit $fail
