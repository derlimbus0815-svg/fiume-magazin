

## fiume.html aktualisieren

Die `fiume.html` ist eine eigenständige Single-File-Version der App. Sie muss manuell synchronisiert werden. Folgende Änderungen fehlen:

### 1. Share-Button in allen Karten-Varianten
- Share-Icon (SVG) neben dem Bookmark-Button in Hero-, Compact- und Grid-Karten einfügen
- `handleShare()`-Funktion im JavaScript hinzufügen: `navigator.share()` → `navigator.clipboard.writeText()` → `execCommand('copy')` Fallback-Kette
- CSS für `.share-btn` analog zu `.bookmark-btn`

### 2. Multi-Proxy Autorenauflösung
- `fetchAuthorFromWeb()` im JavaScript aktualisieren: Proxy-Kette (`allorigins.win`, `corsproxy.io`, `codetabs.com`)
- `post.link` statt konstruierter URL verwenden
- Retry-Logik nach 5 Sekunden bei Fehlschlag

### 3. AboTeaser-Design angleichen
- CSS-Klassen von `.abo-teaser` anpassen: `border-color: var(--border)`, `background: color-mix(in srgb, var(--secondary) 30%, transparent)`
- Icon von Sparkles zu Newspaper ändern
- Button-Style: `background: var(--fg); color: var(--bg)` statt Accent
- Text auf Print-Edition aktualisieren

### 4. Bookmark-Symmetrie (Grid)
- `justify-content: space-between` in Grid-Karten-Meta
- Non-breaking space als Platzhalter bei fehlendem Autor

### Betroffene Datei
- `fiume.html` — CSS, HTML-Templates und JavaScript-Logik

