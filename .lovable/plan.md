
Ziel: Die Startseite soll auch bei weiterem Nachladen immer die echten Verfasser zeigen, nicht die WordPress-Redakteure. Zusätzlich soll oben ein klarer Hell/Dunkel-Toggle erscheinen, und der Abo-Block soll inhaltlich zur FIUME-Printausgabe sowie zu Kultur und Tradition passen.

1. Problemursache bei den Autoren
- Das Kernproblem ist nicht mehr nur die Datenquelle, sondern der Ladefluss:
  - `getPostAuthor()` ist synchron und zeigt zuerst Map/Cache, sonst den WP-Account.
  - `fetchRealAuthor()` läuft aktuell nur auf der Artikeldetailseite.
  - Neu nachgeladene Beiträge auf der Startseite nutzen `PostCard` und bekommen deshalb oft weiter `admin` / `Ledio Albani`, sobald ein Artikel nicht schon in der statischen Map oder im lokalen Cache liegt.
- Deshalb tritt derselbe Fehler beim Infinite Scroll erneut auf.

2. Umsetzbare Lösung für “alle Autoren werden nachgeladen”
Ich würde ein echtes Author-Resolution-System einführen:

- Neue Hook oder Utility für Karten:
  - `useResolvedAuthor(post)` oder ein globaler Author-Store per React Query
- Ablauf:
  1. zuerst statische `AUTHOR_MAP`
  2. dann `localStorage`-Cache
  3. dann asynchrones Laden des echten Namens aus dem Web
  4. nur als letzter Notnagel vorübergehend Publisher-Name anzeigen
- Sobald der echte Name geladen ist, soll die Karte automatisch neu rendern.

Empfohlene technische Form:
- `src/lib/wp-api.ts`
  - Funktion wie `resolveAuthorName(slug)` / `fetchRealAuthor(slug)`
  - zusätzlich robusteres Parsing für das “Von …”-Pattern
  - optional In-Memory-Promise-Cache, damit derselbe Autor-Scrape nicht mehrfach parallel läuft
- `src/components/PostCard.tsx`
  - nicht mehr nur `getPostAuthor(post)` synchron verwenden
  - stattdessen Hook mit State + Effekt, damit auch infinite-scroll-Karten nachziehen
- `src/pages/ArticlePage.tsx`
  - auf dieselbe zentrale Autorlogik umstellen, damit Detailseite und Karten identisch funktionieren

3. Robuster gegen neue Artikel
Damit das nicht bei jedem neuen Artikel wieder kaputtgeht:
- statische Map als Beschleuniger behalten
- aber nicht mehr als Hauptlösung verstehen
- echte Quelle bleibt das Nachladen aus der gerenderten Seite
- Caching:
  - `localStorage` pro Slug
  - optional Ablaufzeit für Author-Cache
  - In-Flight-Cache im Speicher, damit beim Rendern vieler Karten nicht 10x derselbe Request passiert

Sinnvolle Darstellung im UI:
- solange echter Name geladen wird:
  - entweder neutraler Platzhalter wie „Verfasser wird geladen“
  - oder Name erst anzeigen, wenn aufgelöst
- besser nicht sofort den falschen Publisher prominent zeigen, weil das wie ein Datenfehler wirkt

4. Parsing-Strategie für echte Verfasser
Du hast das Pattern klar beschrieben:
- Rubrik
- Titel
- Unterzeile/Übersicht
- dann „Von [Name]“

Darauf würde ich die Extraktion ausrichten:
- Primär: HTML der Artikelseite nach „Von [Name]“ im Headerbereich parsen
- Sekundär: falls Struktur leicht variiert, allgemein auf `>Von ...<` bzw. Listen-/Meta-Blöcke prüfen
- Nur wenn beides fehlschlägt: Publisher-Fallback

Das ist besser als nur auf einzelne bekannte Autoren zu mappen.

5. Heller Modus ganz oben
Aktuell gibt es den Modus nur im Profil. Für intuitive Bedienung würde ich oben in den Header der Startseite einen sichtbaren Toggle setzen:
- rechts oben im Header neben dem FIUME-Branding
- Icon-basiert mit Sonne/Mond
- nutzt den bestehenden `useDarkMode()` Hook
- Profil-Toggle kann bleiben, damit es an beiden Stellen erreichbar ist

Empfehlung:
- kompakter Icon-Button im Header
- optional kleiner Text nur auf größeren Screens
- gleiche Interaktion wie im Profil, damit kein zweites System entsteht

6. Abo-Block inhaltlich anpassen
Der aktuelle Text klingt eher nach digitalem Support. Gewünscht ist Print-Fokus und ein kulturell-traditioneller Ton.

Ich würde den Block neu ausrichten auf:
- FIUME Printausgabe / Print-Abonnement
- Förderung von Kultur, Tradition und unabhängiger Publizistik
- ruhig, seriös, feuilletonnah

Beispielrichtung für den Text:
- Überschrift: „FIUME Print abonnieren“
- Text: „Mit einem Abonnement der FIUME-Printausgabe fördern Sie Kultur, Tradition und unabhängige Publizistik – und erhalten ausgewählte Texte in gedruckter Form.“
- CTA bleibt zunächst Platzhalter, bis echter Link vorhanden ist

7. Newsletter-Möglichkeit
Ja, es gibt dafür grundsätzlich eine umsetzbare Möglichkeit.
Aus der Website ist erkennbar:
- Dort existiert bereits ein echtes Newsletter-Formular mit WordPress-/Newsletter-Plugin (`admin-ajax.php?action=tnp&na=s`)
- Für den Moment können wir bei Platzhalter-UI bleiben
- Später gibt es zwei Optionen:
  1. einfache Verlinkung/Weiterleitung zum echten Formular
  2. direkte Formularanbindung an denselben Endpoint

Für jetzt würde ich nur Text/Design verbessern und die Funktion bewusst als Platzhalter lassen, weil du gesagt hast, die Links müssen noch nicht funktionieren.

8. Betroffene Dateien
- `src/lib/wp-api.ts`
  - zentrale, robuste Author-Resolution
  - Cache / Parsing / Fallback sauber trennen
- `src/components/PostCard.tsx`
  - asynchron nachgeladene Autoren für alle Karten
- `src/pages/ArticlePage.tsx`
  - dieselbe zentrale Autorlogik nutzen
- `src/pages/HomePage.tsx`
  - Theme-Toggle im oberen Header ergänzen
- `src/components/AboTeaser.tsx`
  - Text und Positionierung auf Print/Kultur/Tradition anpassen
- optional `src/components/NewsletterSection.tsx`
  - Copy sprachlich an FIUME angleichen

9. Ergebnis nach Umsetzung
- Auch weiter unten geladene Artikel zeigen nach kurzer Zeit den echten Verfasser
- `admin` / Redakteurskonten erscheinen nicht mehr dauerhaft als scheinbar falsche Autoren
- Die Seite wirkt oben intuitiver durch den Theme-Toggle
- Der Abo-Bereich passt redaktionell viel besser zur Marke FIUME
- Newsletter und Print-Abo bleiben jetzt schon sichtbar, auch wenn die finalen Links erst später kommen

10. Technische Hinweise
- Wichtig ist, Author-Auflösung nicht mehr an die Detailseite zu koppeln.
- Der richtige Ort ist die Kartenebene oder ein gemeinsamer Daten-Layer.
- Um Request-Spam zu vermeiden, sollte es pro Slug nur einen laufenden Fetch geben.
- Wenn viele neue Artikel geladen werden, ist ein Cache essenziell, sonst wird Infinite Scroll unnötig teuer/langsam.
- Für die Startseite reicht ein kleines Enhancement; die bestehende Layout-Struktur muss dafür nicht neu gebaut werden.
