import { useState, useEffect } from "react";
import { type WPPost, AUTHOR_MAP, resolveAuthor } from "@/lib/wp-api";

function getCachedAuthor(slug: string): string | null {
  if (AUTHOR_MAP[slug]) return AUTHOR_MAP[slug];
  try {
    const cached = localStorage.getItem(`fiume_author_${slug}`);
    if (cached) return cached;
  } catch {}
  return null;
}

/**
 * Async-resolves the real author for a post.
 * Shows nothing until resolved to avoid flashing wrong names.
 * Uses post.link for the correct full URL.
 */
export function useResolvedAuthor(post: WPPost | null | undefined): string | null {
  const [name, setName] = useState<string | null>(() =>
    post ? getCachedAuthor(post.slug) : null
  );

  useEffect(() => {
    if (!post) return;

    const cached = getCachedAuthor(post.slug);
    if (cached) {
      setName(cached);
      return;
    }

    let cancelled = false;
    resolveAuthor(post.slug, post.link).then((resolved) => {
      if (!cancelled && resolved) setName(resolved);
    });
    return () => { cancelled = true; };
  }, [post?.slug, post?.link]);

  return name;
}
