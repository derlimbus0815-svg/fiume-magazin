import { useWPCategories, useWPPosts } from "@/hooks/use-wp-posts";
import { useParams, useNavigate } from "react-router-dom";
import { useBookmarks } from "@/hooks/use-bookmarks";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";
import { useRef, useEffect } from "react";

export default function CategoriesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: categories, isLoading: catLoading } = useWPCategories();
  const { isBookmarked, toggle } = useBookmarks();
  const activeRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories?.find((c) => c.slug === slug);
  const { data: posts, isLoading, error, refetch } = useWPPosts(1, activeCategory?.id);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const el = activeRef.current;
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [slug, categories]);

  if (catLoading) return <LoadingSpinner />;

  const filteredCats = categories?.filter(c => c.count > 0) || [];

  return (
    <div className="fiume-safe-bottom">
      <header className="py-4 sm:py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-xl sm:text-2xl">Rubriken</h1>
      </header>

      {/* Scrollable Category Tabs */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto border-b border-border scrollbar-hide snap-x scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <button
          onClick={() => navigate("/rubriken")}
          className={`fiume-touch-target snap-start flex-shrink-0 px-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
            !slug ? "border-accent text-accent" : "border-transparent text-muted-foreground"
          }`}
        >
          Alle
        </button>
        {filteredCats.map((cat) => (
          <button
            key={cat.id}
            ref={slug === cat.slug ? activeRef : null}
            onClick={() => navigate(`/rubriken/${cat.slug}`)}
            className={`fiume-touch-target snap-start flex-shrink-0 px-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
              slug === cat.slug ? "border-accent text-accent" : "border-transparent text-muted-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <section className="px-3 sm:px-4 min-h-[60vh]">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorScreen message={(error as Error).message} onRetry={() => refetch()} />}
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} isBookmarked={isBookmarked(post.id)} onToggleBookmark={toggle} />
        ))}
        {posts && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">Keine Artikel in dieser Rubrik.</p>
        )}
      </section>

      <SocialFooter />
    </div>
  );
}
