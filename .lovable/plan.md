

## fiume.html lokal und via GitHub Pages zum Laufen bringen

### Problem
Beim Öffnen als `file://` blockiert der Browser alle API-Requests (CORS). Auch auf GitHub Pages könnte die WordPress-API CORS-Header fehlen.

### Lösung: Zwei Wege, beide umsetzen

#### Weg 1: CORS-Proxy automatisch nutzen (macht `file://` UND GitHub Pages lauffähig)

In `fiume.html` die `wpFetch`-Funktion erweitern:

```javascript
const IS_LOCAL = location.protocol === 'file:' 
  || !['fiume-magazin.com','lovable.app','lovableproject.com']
      .some(h => location.hostname.includes(h));

async function wpFetch(endpoint, cacheKey) {
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const url = WP_BASE + endpoint;
  let data;
  if (IS_LOCAL) {
    const text = await fetchWithProxyChain(url);
    if (!text) throw new Error('API nicht erreichbar');
    data = JSON.parse(text);
  } else {
    const res = await fetch(url);
    if (!res.ok) throw new Error('WP API Fehler: ' + res.status);
    data = await res.json();
  }
  setCache(cacheKey, data);
  return data;
}
```

Das nutzt die bereits vorhandene `fetchWithProxyChain()` (allorigins, corsproxy, codetabs) für alle API-Aufrufe wenn die Datei lokal oder auf einem fremden Host läuft.

#### Weg 2: GitHub Pages Hosting (empfohlen)

Du kannst die `fiume.html` als `index.html` in ein GitHub-Repo legen und über **GitHub Pages** veröffentlichen. Dann hat sie eine echte `https://`-URL und die CORS-Proxies funktionieren zuverlässig. Anleitung:

1. Neues Repo erstellen (z.B. `fiume-app`)
2. `fiume.html` als `index.html` hochladen
3. Settings → Pages → Source: "main branch" → Save
4. Erreichbar unter `https://deinname.github.io/fiume-app/`

Mit der `IS_LOCAL`-Erkennung funktioniert beides: lokal als `file://` und gehostet auf GitHub Pages.

### Änderungen
- **`fiume.html`**: `IS_LOCAL`-Konstante + `wpFetch`-Funktion anpassen (ca. 10 Zeilen)

