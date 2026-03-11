import { useWPPosts, useWPCategories } from "@/hooks/use-wp-posts";
import { useBookmarks } from "@/hooks/use-bookmarks";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const FEATURED_CATEGORIES = ["politik", "feuilleton", "belletristik", "themen"];

export default function HomePage() {
  const { data: posts, isLoading, error, refetch } = useWPPosts();
  const { data: categories } = useWPCategories();
  const { isBookmarked, toggle } = useBookmarks();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={() => refetch()} />;
  if (!posts?.length) return <ErrorScreen message="Keine Artikel gefunden." />;

  const heroPost = posts[0];
  const restPosts = posts.slice(1, 10);

  const featuredCats = categories?.filter((c) =>
    FEATURED_CATEGORIES.includes(c.slug)
  ) || [];

  return (
    <div className="fiume-safe-bottom">
      {/* Header */}
      <header className="py-5 sm:py-6 text-center border-b border-border">
        <h1 className="fiume-heading text-3xl sm:text-4xl">FIUME</h1>
        <p className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.3em] mt-0.5 uppercase">Magazin</p>
      </header>

      {/* Category Pills – Scrollable */}
      {featuredCats.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {featuredCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/rubriken/${cat.slug}`)}
              className="fiume-touch-target snap-start px-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border border-border rounded-full hover:bg-secondary active:bg-secondary/80 transition-colors flex-shrink-0"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Hero Post – Full bleed */}
      <section className="px-3 sm:px-4 pt-3 pb-1">
        <PostCard post={heroPost} variant="hero" isBookmarked={isBookmarked(heroPost.id)} onToggleBookmark={toggle} />
      </section>

      {/* Recent Posts */}
      <section className="px-3 sm:px-4">
        <h2 className="font-serif text-base sm:text-lg font-semibold mb-0.5 mt-5">Neueste Artikel</h2>
        {restPosts.map((post) => (
          <PostCard key={post.id} post={post} isBookmarked={isBookmarked(post.id)} onToggleBookmark={toggle} />
        ))}
      </section>

      <SocialFooter />
    </div>
  );
}
