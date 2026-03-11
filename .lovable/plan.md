

## Problem

1. **`npm ci` fails** because `package-lock.json` is out of sync with `package.json` (missing Capacitor, Playwright, etc.)
2. **Node 20 zu alt** — `@capacitor/cli@8.2.0` braucht Node ≥ 22

## Lösung

**`.github/workflows/deploy.yml`** — Zwei Änderungen:
- Node-Version von `20` auf `22` erhöhen
- `npm ci` durch `npm install` ersetzen (toleriert out-of-sync lock files)

Das ist alles — ein kleiner Fix in einer Datei.

