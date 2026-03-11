import { useInfiniteWPPosts, useWPCategories } from "@/hooks/use-wp-posts";
import { useBookmarks } from "@/hooks/use-bookmarks";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";
import NewsletterSection from "@/components/NewsletterSection";
import AboTeaser from "@/components/AboTeaser";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import type { WPPost } from "@/lib/wp-api";

const FEATURED_CATEGORIES = ["politik", "feuilleton", "belletristik", "themen"];

// Layout pattern: 3 hero, 4 grid, repeat
const HERO_COUNT = 3;
const GRID_COUNT = 4;
const BLOCK_SIZE = HERO_COUNT + GRID_COUNT;

function chunkPosts(posts: WPPost[]) {
  const blocks: { heroes: WPPost[]; grid: WPPost[] }[] = [];
  let i = 0;
  while (i < posts.length) {
    const heroes = posts.slice(i, i + HERO_COUNT);
    const grid = posts.slice(i + HERO_COUNT, i + BLOCK_SIZE);
    blocks.push({ heroes, grid });
    i += BLOCK_SIZE;
  }
  return blocks;
}

export default function HomePage() {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWPPosts();
  const { data: categories } = useWPCategories();
  const { isBookmarked, toggle } = useBookmarks();
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={() => refetch()} />;
  if (!allPosts.length) return <ErrorScreen message="Keine Artikel gefunden." />;

  const featuredCats =
    categories?.filter((c) => FEATURED_CATEGORIES.includes(c.slug)) || [];

  const blocks = chunkPosts(allPosts);

  return (
    <div className="fiume-safe-bottom">
      {/* Header */}
      <header className="py-5 sm:py-6 border-b border-border relative">
        <div className="text-center">
          <h1 className="fiume-heading text-3xl sm:text-4xl">FIUME</h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground tracking-[0.3em] mt-0.5 uppercase">
            Magazin
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="absolute right-4 top-1/2 -translate-y-1/2 fiume-touch-target p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label={isDark ? "Heller Modus" : "Dunkler Modus"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Category Pills */}
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

      {/* Article blocks with magazine layout */}
      {blocks.map((block, blockIndex) => (
        <div key={blockIndex}>
          {/* Hero posts – full width */}
          <section className="px-3 sm:px-4">
            {block.heroes.map((post, i) => (
              <div key={post.id} className={i === 0 && blockIndex === 0 ? "pt-3" : "pt-4"}>
                <PostCard
                  post={post}
                  variant="hero"
                  isBookmarked={isBookmarked(post.id)}
                  onToggleBookmark={toggle}
                />
              </div>
            ))}
          </section>

          {/* Insert newsletter after first block */}
          {blockIndex === 0 && <NewsletterSection />}

          {/* Grid posts – 2 columns */}
          {block.grid.length > 0 && (
            <section className="px-3 sm:px-4 pt-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {block.grid.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    variant="grid"
                    isBookmarked={isBookmarked(post.id)}
                    onToggleBookmark={toggle}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Insert abo teaser after second block */}
          {blockIndex === 1 && <AboTeaser />}
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="py-8">
          <LoadingSpinner text="Weitere Artikel laden…" />
        </div>
      )}
      {!hasNextPage && allPosts.length > BLOCK_SIZE && (
        <p className="text-center text-xs text-muted-foreground py-6">
          Alle Artikel geladen
        </p>
      )}

      <SocialFooter />
    </div>
  );
}
