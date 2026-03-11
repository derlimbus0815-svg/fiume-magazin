import { useBookmarks } from "@/hooks/use-bookmarks";
import { useWPPosts } from "@/hooks/use-wp-posts";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks, isBookmarked, toggle } = useBookmarks();
  const { data: posts, isLoading } = useWPPosts(1, undefined);

  const bookmarkedPosts = posts?.filter((p) => bookmarks.includes(p.id)) || [];

  return (
    <div className="fiume-safe-bottom">
      <header className="py-4 sm:py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-xl sm:text-2xl">Lesezeichen</h1>
      </header>

      <section className="px-3 sm:px-4 min-h-[60vh]">
        {isLoading && <LoadingSpinner />}
        {!isLoading && bookmarkedPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bookmark size={40} strokeWidth={1} className="mb-3 opacity-40" />
            <p className="text-sm">Noch keine Lesezeichen gespeichert.</p>
            <p className="text-xs mt-1">Tippe auf das Lesezeichen-Symbol bei einem Artikel.</p>
          </div>
        )}
        {bookmarkedPosts.map((post) => (
          <PostCard key={post.id} post={post} isBookmarked={isBookmarked(post.id)} onToggleBookmark={toggle} />
        ))}
      </section>
    </div>
  );
}
