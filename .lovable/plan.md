

## Autoren-Fix: Echte Verfasser statt WordPress-Redakteure

### Problem (bestätigt)
Die WP REST API gibt im `_embedded.author`-Feld den **WordPress-Account** zurück, der den Artikel veröffentlicht hat (z.B. "Ledio Albani", "Barbara Steemann") — nicht den echten Verfasser. Die echten Autoren stehen auf der Website als Elementor Custom Field: `"Von Yotam Givoli"`, `"Von Sebastian Schwaerzel"`, etc.

Dieses Custom Field ist **nicht über die Standard-API zugänglich** (meta enthält nur `_acf_changed` und `footnotes`).

### Lösung

**Einen Slug-zu-Autor-Map aus der gerenderten Website extrahieren und im Code hinterlegen.** Zusätzlich einen Runtime-Scraper als Fallback, der beim Öffnen eines Artikels die echte Seite fetcht.

#### Konkret:

**1. Statische Author-Map in `src/lib/wp-api.ts`**
Hardcoded Mapping aus allen bekannten Artikeln (aus der Website-Analyse):

```text
what-do-you-do-sir → Yotam Givoli
das-amitabha-sutra → Sebastian Schwaerzel
exkulpation-gottlos → Ledio Albani
sie-haeuten-die-menschen → Roland R. Maxwell
codex-hammurabi-stempel-schuld-und-stein → Daniel Yakubovich
die-agonie-der-neuen-rechten → Jörg Rüdiger Mayer
plain-and-colored → Gaurav Monga
gerechtigkeit-fuer-serbien → Filip Gašpar
kristina-ballova-im-interview → Kristina Ballova
don-juan-in-der-unterwelt → Ledio Albani
ex-serbien → Günther Fehlinger-Jahn
stumme-freundin → Adorján Kovács
kinderzauber → Philipp von Goenitzer
aldous-huxleys-zukunftsschau → Roman Raskolnikow
wiener-ballfuehrer → Redaktion
dichtungen-der-maler-und-bildner → Redaktion
fuck → His excellence Fungus Kaiser Babba Zabba
epiphyten → Barbara Steemann
das-gluecksversprechen → Moritz Ostertag
das-stachelschwein-dilemma → Noel Vinzentz
```

**2. Runtime-Fallback für unbekannte Artikel**
Für Artikel die nicht in der Map sind: Die gerenderte Artikelseite (`fiume-magazin.com/...`) fetchen und den Author aus dem HTML-Pattern `elementor-post-info__item--type-custom` extrahieren (`Von [Name]`). Ergebnis wird im localStorage gecacht.

> Hinweis: Dies kann an CORS scheitern. Falls ja, nutzen wir einen einfachen CORS-Proxy (`allorigins.win`) oder fallen auf den API-Author zurück.

**3. `getPostAuthor()` Logik ändern**

```text
1. Prüfe slug in AUTHOR_MAP → return mapped name
2. Prüfe localStorage-Cache für slug → return cached name  
3. (Async) Fetch rendered page, parse "Von [Name]", cache result
4. Fallback: _embedded.author (WordPress-Account)
```

**4. Dateien die geändert werden:**
- `src/lib/wp-api.ts` — Author-Map + neue `getPostAuthor()` Logik + async `fetchRealAuthor()`
- `src/components/PostCard.tsx` — Nutzt neue Author-Funktion (sync aus Map)
- `src/pages/ArticlePage.tsx` — Nutzt async Author-Fetch als Enhancement

Kein Avatar mehr anzeigen (die echten Autoren haben keinen Gravatar), stattdessen nur den Namen elegant darstellen.

