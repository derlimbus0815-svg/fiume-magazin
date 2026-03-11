# FIUME Magazin – GitHub Pages Deployment

## Automatisches Deployment (empfohlen)

Die App wird bei jedem Push automatisch auf GitHub Pages gebaut und veröffentlicht – identisch zur Lovable-Version.

### 1. GitHub verbinden

1. Öffne dein Lovable-Projekt
2. Gehe zu **Settings** → **GitHub** → **Connect project**
3. Autorisiere die Lovable GitHub App
4. Klicke auf **Create Repository**

### 2. GitHub Pages aktivieren

1. Gehe zu deinem neuen Repository auf GitHub
2. **Settings** → **Pages** (linkes Menü)
3. Unter **Source** wähle: **GitHub Actions**
4. Klicke auf **Save**

### 3. Fertig! 🎉

Nach dem nächsten Push (oder manuell über **Actions** → **Run workflow**) ist deine App erreichbar unter:

```
https://DEIN-USERNAME.github.io/REPO-NAME/
```

## Hinweise

- Jede Änderung in Lovable wird automatisch nach GitHub gepusht und neu gebaut
- Die GitHub-Pages-Version ist **identisch** zur Lovable-Version
- Funktioniert auf allen Geräten (Handy, Desktop) über HTTPS
- Die standalone `fiume.html` wird nicht mehr benötigt
