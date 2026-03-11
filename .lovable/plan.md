

## Problem

Auf GitHub Pages läuft die App unter einem Unterpfad wie `https://username.github.io/repo-name/`. Der `BrowserRouter` weiß davon nichts — er sieht `/repo-name/` als Pfad und findet keine passende Route → 404. Sobald du innerhalb der App navigierst (z.B. Rubriken → Home), funktioniert alles, weil React Router dann die Navigation übernimmt.

## Lösung

**`src/App.tsx`** — Eine Zeile ändern:

```tsx
// Vorher:
<BrowserRouter>

// Nachher:
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

Vite setzt `BASE_URL` automatisch aus dem `base`-Wert in `vite.config.ts` (der bereits auf `VITE_BASE_PATH` konfiguriert ist). Damit weiß der Router, dass `/repo-name/` die Startseite `/` ist.

Das ist alles — ein Einzeiler.

