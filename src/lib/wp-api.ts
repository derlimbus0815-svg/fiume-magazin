const WP_BASE = "https://fiume-magazin.com/wp-json/wp/v2";

export interface WPPost {
  id: number;
  date: string;
  link: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url: string };
          large?: { source_url: string };
          full?: { source_url: string };
        };
      };
    }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: Record<string, string>;
      description?: string;
    }>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

const CACHE_DURATION = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`fiume_cache_${key}`);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`fiume_cache_${key}`);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache(key: string, data: unknown) {
  try {
    localStorage.setItem(`fiume_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

async function wpFetch<T>(endpoint: string, cacheKey: string): Promise<T> {
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${WP_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`WP API error: ${res.status}`);
  const data = await res.json();
  setCache(cacheKey, data);
  return data as T;
}

export async function getPosts(page = 1, perPage = 20, categoryId?: number): Promise<WPPost[]> {
  let endpoint = `/posts?_embed&per_page=${perPage}&page=${page}&orderby=date`;
  if (categoryId) endpoint += `&categories=${categoryId}`;
  return wpFetch<WPPost[]>(endpoint, `posts_${page}_${perPage}_${categoryId || "all"}`);
}

export async function getPost(slug: string): Promise<WPPost> {
  const posts = await wpFetch<WPPost[]>(`/posts?_embed&slug=${slug}`, `post_${slug}`);
  if (!posts.length) throw new Error("Post not found");
  return posts[0];
}

export async function getCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>("/categories?per_page=100", "categories");
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  return wpFetch<WPPost[]>(`/posts?_embed&search=${encodeURIComponent(query)}&per_page=20`, `search_${query}`);
}

export function getPostImage(post: WPPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return (
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.source_url
  );
}

export function getPostCategories(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  return post._embedded?.["wp:term"]?.[0] || [];
}

// Static author map: slug → real author name
export const AUTHOR_MAP: Record<string, string> = {
  "what-do-you-do-sir": "Yotam Givoli",
  "das-amitabha-sutra": "Sebastian Schwaerzel",
  "exkulpation-gottlos": "Ledio Albani",
  "sie-haeuten-die-menschen": "Roland R. Maxwell",
  "codex-hammurabi-stempel-schuld-und-stein": "Daniel Yakubovich",
  "die-agonie-der-neuen-rechten": "Jörg Rüdiger Mayer",
  "plain-and-colored": "Gaurav Monga",
  "gerechtigkeit-fuer-serbien": "Filip Gašpar",
  "kristina-ballova-im-interview": "Kristina Ballova",
  "don-juan-in-der-unterwelt": "Ledio Albani",
  "ex-serbien": "Günther Fehlinger-Jahn",
  "stumme-freundin": "Adorján Kovács",
  "kinderzauber": "Philipp von Goenitzer",
  "aldous-huxleys-zukunftsschau": "Roman Raskolnikow",
  "wiener-ballfuehrer": "Redaktion",
  "dichtungen-der-maler-und-bildner": "Redaktion",
  "fuck": "His excellence Fungus Kaiser Babba Zabba",
  "epiphyten": "Barbara Steemann",
  "das-gluecksversprechen": "Moritz Ostertag",
  "das-stachelschwein-dilemma": "Noel Vinzentz",
};

export function getPostAuthor(post: WPPost): { name: string; avatar?: string } | null {
  // 1. Check static map by slug
  const mapped = AUTHOR_MAP[post.slug];
  if (mapped) return { name: mapped };

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`fiume_author_${post.slug}`);
    if (cached) return { name: cached };
  } catch {}

  // 3. Fallback to WP API author (the publisher account)
  const author = post._embedded?.author?.[0];
  if (!author) return null;
  return { name: author.name };
}

// In-flight promise cache to deduplicate concurrent author fetches
const authorFetchCache = new Map<string, Promise<string | null>>();

// CORS proxy chain – try each in order until one succeeds
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

/**
 * Central author resolution: map → localStorage → scrape from web using post.link.
 * Deduplicates in-flight requests so infinite scroll doesn't spam.
 */
export async function resolveAuthor(slug: string, postLink?: string): Promise<string | null> {
  // 1. Static map
  if (AUTHOR_MAP[slug]) return AUTHOR_MAP[slug];

  // 2. localStorage cache
  try {
    const cached = localStorage.getItem(`fiume_author_${slug}`);
    if (cached) return cached;
  } catch {}

  // Need a link to scrape
  if (!postLink) return null;

  // 3. Deduplicated fetch
  const cacheKey = slug;
  if (authorFetchCache.has(cacheKey)) return authorFetchCache.get(cacheKey)!;

  const promise = fetchAuthorFromWeb(slug, postLink);
  authorFetchCache.set(cacheKey, promise);

  try {
    const result = await promise;
    return result;
  } finally {
    setTimeout(() => authorFetchCache.delete(cacheKey), 60_000);
  }
}

function extractAuthorFromHtml(html: string): string | null {
  const patterns = [
    /elementor-post-info__item--type-custom[^>]*>[\s]*Von\s+([^<]+)/i,
    />Von\s+([^<]{2,60})</i,
    /class="[^"]*author[^"]*"[^>]*>[\s]*Von\s+([^<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim();
      if (name && name !== "admin" && name.length > 1) return name;
    }
  }
  return null;
}

async function fetchWithProxyChain(targetUrl: string): Promise<string | null> {
  for (const makeProxy of CORS_PROXIES) {
    try {
      const res = await fetch(makeProxy(targetUrl));
      if (res.ok) return await res.text();
    } catch {}
  }
  return null;
}

async function fetchAuthorFromWeb(slug: string, postLink: string, retry = true): Promise<string | null> {
  const html = await fetchWithProxyChain(postLink);

  if (html) {
    const name = extractAuthorFromHtml(html);
    if (name) {
      try { localStorage.setItem(`fiume_author_${slug}`, name); } catch {}
      return name;
    }
  }

  // Retry once after 5s if all proxies failed
  if (retry) {
    await new Promise((r) => setTimeout(r, 5000));
    return fetchAuthorFromWeb(slug, postLink, false);
  }

  return null;
}

// Keep fetchRealAuthor as alias for backward compat
export const fetchRealAuthor = resolveAuthor;

export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
