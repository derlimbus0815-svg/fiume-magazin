import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWPPost } from "@/hooks/use-wp-posts";
import { getPostImage, getPostCategories, formatDate } from "@/lib/wp-api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error, refetch } = useWPPost(slug || "");

  if (isLoading) return <LoadingSpinner />;
  if (error || !post) return <ErrorScreen message="Artikel nicht gefunden." onRetry={() => refetch()} />;

  const image = getPostImage(post);
  const categories = getPostCategories(post);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title.rendered,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div className="fiume-safe-bottom">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => navigate(-1)} className="fiume-touch-target">
            <ArrowLeft size={22} />
          </button>
          <span className="fiume-heading text-sm">FIUME</span>
          <button onClick={handleShare} className="fiume-touch-target">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {image && (
          <img
            src={image}
            alt={post.title.rendered}
            className="w-full aspect-[16/10] object-cover"
          />
        )}

        <div className="px-5 py-6">
          {categories[0] && <span className="fiume-category">{categories[0].name}</span>}

          <h1
            className="font-serif text-3xl font-bold leading-tight mt-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <time className="text-xs text-muted-foreground mt-3 block tracking-wide uppercase">
            {formatDate(post.date)}
          </time>

          <div
            className="fiume-article-body mt-8"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </motion.article>

      <SocialFooter />
    </div>
  );
}
