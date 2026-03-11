# FIUME Magazin – GitHub Pages Deployment

## Schnellanleitung

### 1. Neues GitHub-Repository erstellen
- Gehe zu [github.com/new](https://github.com/new)
- Repository-Name: z.B. `fiume-app`
- Sichtbarkeit: **Public** (für kostenlose GitHub Pages)
- Klicke auf **Create repository**

### 2. Datei hochladen
- Klicke auf **uploading an existing file**
- Lade die Datei `fiume.html` hoch
- **Wichtig:** Benenne sie in `index.html` um (entweder vorher lokal oder nach dem Upload über GitHub)
- Klicke auf **Commit changes**

### 3. GitHub Pages aktivieren
- Gehe zu **Settings** → **Pages** (linkes Menü)
- Unter **Source** wähle: **Deploy from a branch**
- Branch: **main** / Ordner: **/ (root)**
- Klicke auf **Save**

### 4. Fertig! 🎉
Nach ca. 1–2 Minuten ist deine App erreichbar unter:

```
https://DEIN-USERNAME.github.io/fiume-app/
```

## Hinweise

- Die App lädt alle Artikel live von der WordPress-API (`fiume-magazin.com`)
- Alle API-Anfragen laufen über CORS-Proxies (allorigins, corsproxy, codetabs)
- Dark Mode, Lesezeichen und Einstellungen werden lokal im Browser gespeichert
- Die Datei funktioniert auch lokal in **Google Chrome** (nicht in Safari wegen Sicherheitseinschränkungen)
