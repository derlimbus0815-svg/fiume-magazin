const WP_BASE = "https://fiume-magazin.com/wp-json/wp/v2";

export interface WPPost {
  id: number;
  date: string;
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

export function getPostAuthor(post: WPPost): { name: string; avatar?: string } | null {
  const author = post._embedded?.author?.[0];
  if (!author) return null;
  return {
    name: author.name,
    avatar: author.avatar_urls?.["96"] || author.avatar_urls?.["48"],
  };
}

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
