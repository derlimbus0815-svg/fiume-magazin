import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "fiume_bookmarks";

function getStoredBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>(getStoredBookmarks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggle = useCallback((postId: number) => {
    setBookmarks((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const isBookmarked = useCallback(
    (postId: number) => bookmarks.includes(postId),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked };
}
