import { useWPPosts, useWPCategories } from "@/hooks/use-wp-posts";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";
import { useNavigate } from "react-router-dom";

const FEATURED_CATEGORIES = ["politik", "feuilleton", "belletristik", "themen"];

export default function HomePage() {
  const { data: posts, isLoading, error, refetch } = useWPPosts();
  const { data: categories } = useWPCategories();
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorScreen message={(error as Error).message} onRetry={() => refetch()} />;
  if (!posts?.length) return <ErrorScreen message="Keine Artikel gefunden." />;

  const heroPost = posts[0];
  const restPosts = posts.slice(1, 7);

  const featuredCats = categories?.filter((c) =>
    FEATURED_CATEGORIES.includes(c.slug)
  ) || [];

  return (
    <div className="fiume-safe-bottom">
      {/* Header */}
      <header className="py-6 text-center border-b border-border">
        <h1 className="fiume-heading text-4xl">FIUME</h1>
        <p className="text-xs text-muted-foreground tracking-[0.3em] mt-1 uppercase">Magazin</p>
      </header>

      {/* Category Pills */}
      {featuredCats.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {featuredCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/rubriken/${cat.slug}`)}
              className="fiume-touch-target px-4 text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border border-border rounded-full hover:bg-secondary transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Hero Post */}
      <section className="px-4 pt-4 pb-2">
        <PostCard post={heroPost} variant="hero" />
      </section>

      {/* Recent Posts */}
      <section className="px-4">
        <h2 className="font-serif text-lg font-semibold mb-1 mt-6">Neueste Artikel</h2>
        {restPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <SocialFooter />
    </div>
  );
}
