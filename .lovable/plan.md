

## Analyse: Warum es auf GitHub nicht funktioniert

Es gibt hier drei verschiedene Probleme:

### Problem 1: GitHub Pages zeigt weißen Bildschirm
Wenn du das Projekt über Lovable mit GitHub verbindest, wird der **React-Quellcode** hochgeladen — nicht eine fertige Website. GitHub Pages kann damit nichts anfangen, weil es den Code erst **bauen** muss (wie Lovable das intern automatisch tut). Ohne Build-Schritt → weiße Seite.

### Problem 2: fiume.html auf dem Handy wird als Text angezeigt
Auf dem Handy behandelt das System `.html`-Dateien aus GitHub als Textdatei, nicht als Website. Das ist eine Einschränkung von iOS/Android beim Öffnen von heruntergeladenen Dateien.

### Problem 3: fiume.html sieht anders aus als die Lovable-App
Die `fiume.html` ist ein **separater Prototyp** — ein komplett anderer Code als die React-App. Deshalb sieht sie anders aus und hat nicht alle Features.

---

## Lösung: GitHub Actions Build-Pipeline

Wir richten eine **automatische Build-Pipeline** ein. Jedes Mal wenn Lovable Code nach GitHub pusht, baut GitHub die App automatisch und veröffentlicht sie auf GitHub Pages — **identisch** zur Lovable-Version.

### Änderungen

1. **`.github/workflows/deploy.yml`** — Neue Datei
   - GitHub Action die bei jedem Push auf `main` automatisch `npm install` + `npm run build` ausführt
   - Das Ergebnis wird auf GitHub Pages deployed
   - Ergebnis: `https://dein-username.github.io/repo-name/` zeigt die **exakt gleiche** App wie Lovable

2. **`vite.config.ts`** — Kleine Anpassung
   - `base`-Pfad dynamisch setzen, damit Assets auf GitHub Pages korrekt geladen werden (GitHub Pages nutzt einen Unterpfad wie `/repo-name/`)

3. **`DEPLOY.md`** — Aktualisierte Anleitung
   - Schritt-für-Schritt: GitHub verbinden → Pages aktivieren → fertig
   - Kein manuelles Hochladen von Dateien mehr nötig

### Ergebnis
- Die GitHub-Pages-Version ist **identisch** zur Lovable-App
- Automatisches Update bei jeder Änderung
- Funktioniert auf Handy, Desktop, überall — über einen normalen HTTPS-Link
- Die standalone `fiume.html` wird nicht mehr gebraucht

