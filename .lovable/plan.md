

## Fixes: Zuverlässige Autorenauflösung & Share-Button auf Übersicht

### 1. Kernproblem bei den Autoren (Deep Analysis)

Die Autorenauflösung scheitert aus **zwei Gründen**:

**a) Falsche URL-Konstruktion.**
Der Scraper konstruiert `fiume-magazin.com/${slug}/`, aber die echten Artikel-URLs haben Kategorie-Pfade:
- Scraper versucht: `fiume-magazin.com/what-do-you-do-sir/`
- Echte URL: `fiume-magazin.com/politik/kommentare/what-do-you-do-sir/`

Manche Slugs sind auch Kategorie-Slugs, dann bekommt man eine Archivseite statt des Artikels.

**b) Unzuverlässiger CORS-Proxy.**
`allorigins.win` gibt intermittierend 500er zurück. Das erklärt warum manche Autoren geladen werden und manche nicht.

### Lösung

**1. `link`-Feld aus der WP API nutzen**
Die WP API liefert bei jedem Post ein `link`-Feld mit der vollständigen URL (z.B. `https://fiume-magazin.com/politik/kommentare/what-do-you-do-sir/`). Dieses wird aktuell ignoriert.

- `WPPost` Interface erweitern um `link: string`
- `resolveAuthor()` bekommt die volle URL statt nur den Slug
- `useResolvedAuthor(post)` nutzt `post.link` für den Scrape

**2. Mehrere CORS-Proxies mit Fallback**
Statt nur `allorigins.win` werden mehrere Proxies nacheinander versucht:
```text
1. https://api.allorigins.win/raw?url=
2. https://corsproxy.io/?url=
3. https://api.codetabs.com/v1/proxy?quest=
```
Wenn einer fehlschlägt, wird der nächste probiert. Das macht die Auflösung robust.

**3. Kein WP-API-Author als Fallback**
Der User will keinen falschen Namen sehen. Wenn der Scrape noch läuft oder fehlschlägt:
- Autoren-Bereich bleibt leer (kein "admin", kein Publisher-Name)
- Nur der echte Name wird angezeigt, sobald aufgelöst
- Etwas längere Ladezeit ist akzeptabel

**4. Retry-Logik**
Wenn alle Proxies fehlschlagen, nach 5 Sekunden noch einmal versuchen (1x Retry). Das deckt temporäre Ausfälle ab.

### 2. Share-Button auf der Übersicht (PostCard)

- Alle drei Varianten (hero, grid, compact) bekommen einen Share-Button neben dem Bookmark
- `navigator.share()` API nutzen (wie auf der Artikelseite bereits implementiert)
- Fallback: URL in die Zwischenablage kopieren mit Toast-Nachricht
- Share-URL: `window.location.origin + /artikel/${post.slug}`

### Betroffene Dateien

- **`src/lib/wp-api.ts`**
  - `WPPost` Interface: `link` hinzufügen
  - `resolveAuthor(slug, link)`: link-Parameter, Multi-Proxy-Fallback
  - `fetchAuthorFromWeb()`: Echte URL nutzen, Proxy-Kette

- **`src/hooks/use-resolved-author.ts`**
  - `post.link` an `resolveAuthor` übergeben
  - Kein WP-API-Fallback mehr

- **`src/components/PostCard.tsx`**
  - Share-Button (Share2-Icon) neben Bookmark in allen drei Varianten
  - `handleShare()` Funktion mit `navigator.share` + Clipboard-Fallback

