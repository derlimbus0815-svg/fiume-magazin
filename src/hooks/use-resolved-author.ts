import { useState, useEffect } from "react";
import { type WPPost, resolveAuthor } from "@/lib/wp-api";

/**
 * Hook that asynchronously resolves the real author name for a post.
 * Shows nothing until resolved (avoids showing wrong publisher names).
 */
export function useResolvedAuthor(post: WPPost | null | undefined): string | null {
  const [name, setName] = useState<string | null>(() => {
    if (!post) return null;
    // Immediately return from static map or localStorage cache
    return getCachedAuthor(post.slug);
  });

  useEffect(() => {
    if (!post) return;

    // If we already have it synchronously, we're done
    const cached = getCachedAuthor(post.slug);
    if (cached) {
      setName(cached);
      return;
    }

    let cancelled = false;
    resolveAuthor(post.slug).then((resolved) => {
      if (!cancelled && resolved) setName(resolved);
    });
    return () => { cancelled = true; };
  }, [post?.slug]);

  return name;
}

function getCachedAuthor(slug: string): string | null {
  // Check static map
  const { AUTHOR_MAP } = require("@/lib/wp-api");
  if (AUTHOR_MAP[slug]) return AUTHOR_MAP[slug];

  // Check localStorage
  try {
    const cached = localStorage.getItem(`fiume_author_${slug}`);
    if (cached) return cached;
  } catch {}

  return null;
}
