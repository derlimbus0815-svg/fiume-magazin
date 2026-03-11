import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useWPPost } from "@/hooks/use-wp-posts";
import { getPostImage, getPostCategories, formatDate } from "@/lib/wp-api";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useResolvedAuthor } from "@/hooks/use-resolved-author";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorScreen from "@/components/ErrorScreen";
import SocialFooter from "@/components/SocialFooter";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error, refetch } = useWPPost(slug || "");
  const { isBookmarked, toggle } = useBookmarks();
  const authorName = useResolvedAuthor(post);

  if (isLoading) return <LoadingSpinner />;
  if (error || !post) return <ErrorScreen message="Artikel nicht gefunden." onRetry={() => refetch()} />;

  const image = getPostImage(post);
  const categories = getPostCategories(post);
  const bookmarked = isBookmarked(post.id);

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
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggle(post.id)}
              className="fiume-touch-target"
              aria-label={bookmarked ? "Lesezeichen entfernen" : "Lesezeichen hinzufügen"}
            >
              {bookmarked ? <BookmarkCheck size={20} className="text-accent" /> : <Bookmark size={20} />}
            </button>
            <button onClick={handleShare} className="fiume-touch-target">
              <Share2 size={20} />
            </button>
          </div>
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

        <div className="px-4 sm:px-5 py-5 sm:py-6">
          {categories[0] && <span className="fiume-category">{categories[0].name}</span>}

          <h1
            className="font-serif text-2xl sm:text-3xl font-bold leading-tight mt-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Author & date row */}
          <div className="flex items-center gap-3 mt-4 pb-4 border-b border-border">
            {authorName && (
              <span className="text-sm font-medium">{authorName}</span>
            )}
            <time className="text-xs text-muted-foreground tracking-wide uppercase ml-auto">
              {formatDate(post.date)}
            </time>
          </div>

          <div
            className="fiume-article-body mt-6"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </motion.article>

      <SocialFooter />
    </div>
  );
}
