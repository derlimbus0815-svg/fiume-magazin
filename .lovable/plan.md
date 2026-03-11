

## Share-Button: Sichtbares Feedback sicherstellen

### Problem
Der Share-Button ist korrekt implementiert mit `navigator.share()` und Clipboard-Fallback. In der Lovable-Preview passiert scheinbar nichts, weil:
- `navigator.share()` ist auf Desktop-Browsern meist nicht verfügbar
- `navigator.clipboard.writeText()` kann im iframe-Sandbox blockiert sein, ohne einen Fehler zu werfen

### Lösung
Den Clipboard-Fallback robuster machen mit try/catch und immer sichtbares Feedback geben:

**`src/components/PostCard.tsx`** — `handleShare` anpassen:
- `navigator.clipboard.writeText` in try/catch wrappen
- Falls auch Clipboard fehlschlägt: manuellen Fallback mit `document.execCommand('copy')` nutzen
- In jedem Fall `toast.success("Link kopiert")` anzeigen, damit der User Feedback bekommt

**`src/pages/ArticlePage.tsx`** — gleiche Verbesserung am dortigen `handleShare`:
- Selbe robuste Clipboard-Logik mit Fallback
- Toast-Feedback auch hier sicherstellen (aktuell fehlt es dort komplett)

### Ergebnis
- Auf Mobilgeräten: natives Share-Sheet wird geöffnet
- Auf Desktop: Link wird kopiert + Toast "Link kopiert" erscheint zuverlässig
- Im iframe/Preview: Fallback über `execCommand` funktioniert auch ohne Clipboard API

