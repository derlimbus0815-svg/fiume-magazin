

## Plan: Infinite Scroll, Magazin-Layout & Newsletter/Abo-Sektion

### 1. Infinite Scroll (alle Artikel auffindbar)

**Problem:** Die App fetcht nur 1 Seite (20 Posts) und zeigt davon nur 10 an. Kein Weiterscrollen möglich.

**Lösung:** `useInfiniteQuery` von TanStack React Query statt `useQuery`.

- `src/hooks/use-wp-posts.ts`: Neuer Hook `useInfiniteWPPosts()` mit `getNextPageParam` (Seitenzahl hochzählen, stoppen wenn weniger als `perPage` Posts zurückkommen)
- `src/pages/HomePage.tsx`: IntersectionObserver am Ende der Liste, der `fetchNextPage()` triggert wenn der User nach unten scrollt
- Loading-Indikator am Ende der Liste während neue Artikel laden

### 2. Magazin-Layout auf der Startseite

**Aktuell:** 1 Hero-Post oben, dann alle weiteren als kleine compact-Cards.

**Neu (wie fiume-magazin.com):** Abwechselndes Layout in Blöcken:

```text
┌─────────────────────┐
│   HERO (Post 1)     │  ← Volle Breite, großes Bild
├─────────────────────┤
│   HERO (Post 2)     │  ← Volle Breite, großes Bild  
├─────────────────────┤
│   HERO (Post 3)     │  ← Volle Breite, großes Bild
├──────────┬──────────┤
│ compact  │ compact  │  ← 2-Spalten-Grid
│ Post 4   │ Post 5   │
├──────────┼──────────┤
│ compact  │ compact  │
│ Post 6   │ Post 7   │
├─────────────────────┤
│   HERO (Post 8)     │  ← Nächster großer Block
├─────────────────────┤
│   ...wiederholt...   │
└─────────────────────┘
```

- Die ersten 3 Posts als Hero-Cards (groß, mit Bild-Overlay)
- Danach 4 Posts im 2-Spalten-Grid (kompakter, Thumbnail + Titel)
- Dieses Muster wiederholt sich für alle geladenen Posts
- Neuer PostCard-Variant `"grid"` für die 2-Spalten-Darstellung (vertikale Karte mit Bild oben, Titel unten)

**Dateien:** `src/pages/HomePage.tsx` (Layout-Logik), `src/components/PostCard.tsx` (neuer `grid`-Variant)

### 3. Newsletter & Abo-Sektion

**Möglichkeiten ohne Backend:**

| Feature | Umsetzung | Funktioniert sofort? |
|---|---|---|
| Newsletter-Anmeldung | UI-Formular mit E-Mail-Feld, Button "Abonnieren" | Nur UI, Link/Action bleibt Platzhalter |
| Abo-Bereich | CTA-Banner "Jetzt abonnieren" mit Preisinfos | Nur UI, Link bleibt Platzhalter |
| Mailchimp/Sendinblue | Formular postet an externe Signup-URL | Funktioniert wenn URL hinterlegt |

**Umsetzung:** 
- Neue Komponente `NewsletterSection` — elegantes Formular im Magazin-Stil mit E-Mail-Input, eingebettet zwischen Artikelblöcken auf der Startseite
- Neue Komponente `AboTeaser` — CTA-Banner mit kurzem Text ("Unterstütze unabhängigen Journalismus") und Button
- Beide mit Platzhalter-Links (`href="#"` / `console.log`), die später mit echten Endpoints ersetzt werden
- Positionierung: Newsletter nach dem ersten Artikelblock, Abo-Teaser weiter unten oder im Footer

### 4. Dateien die geändert werden

- **`src/hooks/use-wp-posts.ts`** — `useInfiniteWPPosts` Hook hinzufügen
- **`src/pages/HomePage.tsx`** — Infinite Scroll + neues Magazin-Layout + Newsletter/Abo einbetten
- **`src/components/PostCard.tsx`** — Neuer `grid`-Variant
- **`src/components/NewsletterSection.tsx`** — Neue Komponente
- **`src/components/AboTeaser.tsx`** — Neue Komponente

