import { useWPCategories, useWPPosts } from "@/hooks/use-wp-posts";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";

export default function CategoriesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: categories, isLoading: catLoading } = useWPCategories();

  const activeCategory = categories?.find((c) => c.slug === slug);
  const { data: posts, isLoading, error, refetch } = useWPPosts(1, activeCategory?.id);

  if (catLoading) return <LoadingSpinner />;

  return (
    <div className="fiume-safe-bottom">
      <header className="py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-2xl">Rubriken</h1>
      </header>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto border-b border-border scrollbar-hide">
        <button
          onClick={() => navigate("/rubriken")}
          className={`fiume-touch-target px-4 text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
            !slug ? "border-accent text-accent" : "border-transparent text-muted-foreground"
          }`}
        >
          Alle
        </button>
        {categories?.filter(c => c.count > 0).map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/rubriken/${cat.slug}`)}
            className={`fiume-touch-target px-4 text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
              slug === cat.slug ? "border-accent text-accent" : "border-transparent text-muted-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <section className="px-4 min-h-[60vh]">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorScreen message={(error as Error).message} onRetry={() => refetch()} />}
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {posts && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">Keine Artikel in dieser Rubrik.</p>
        )}
      </section>

      <SocialFooter />
    </div>
  );
}
