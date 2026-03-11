

## Problem

Beim direkten Öffnen der `fiume.html` als lokale Datei (`file://`) blockiert **Safari** (Mac und iPhone) **alle** Netzwerk-Anfragen – auch die über CORS-Proxies. Das ist eine harte Browser-Sicherheitseinschränkung, die sich nicht per JavaScript umgehen lässt. Chrome ist etwas toleranter, aber auch dort gibt es Einschränkungen.

Deshalb siehst du nur den schwarzen Hintergrund (Dark Mode CSS lädt) aber keine Artikel.

## Lösung: Zwei Dateien vorbereiten

### 1. `index.html` für GitHub Pages (zuverlässigste Lösung)
- Kopie der `fiume.html` als `index.html` im Projekt-Root
- Funktioniert sofort über `https://deinname.github.io/fiume-app/`
- Alle API-Calls laufen über die CORS-Proxy-Kette – zuverlässig, weil `https://`

### 2. `fiume.html` verbessern für lokale Nutzung
- Bessere Fehlermeldung statt schwarzem Bildschirm: "Bitte öffne diese Datei in Chrome oder nutze die Online-Version unter [GitHub Pages URL]"
- Beim Start einen sichtbaren Hinweis anzeigen, wenn `file://` + Safari erkannt wird
- Fallback: Bei Fehler einen Button "In Chrome öffnen" und Link zur Online-Version zeigen

### 3. Kurzanleitung als `DEPLOY.md`
```text
1. Erstelle ein neues GitHub-Repo (z.B. "fiume-app")
2. Lade index.html hoch
3. Settings → Pages → Source: main → Save
4. Fertig: https://deinname.github.io/fiume-app/
```

### Betroffene Dateien
- `fiume.html` – Fehlerbehandlung + Nutzerhinweis bei file://
- `index.html` – neue Datei (Kopie für GitHub Pages)
- `DEPLOY.md` – neue Datei (Kurzanleitung)

