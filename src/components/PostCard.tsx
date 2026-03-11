import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { type WPPost, getPostImage, getPostCategories, stripHtml, formatDate } from "@/lib/wp-api";
import { useResolvedAuthor } from "@/hooks/use-resolved-author";
import { toast } from "sonner";

interface PostCardProps {
  post: WPPost;
  variant?: "hero" | "compact" | "grid";
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
}

export default function PostCard({ post, variant = "compact", isBookmarked, onToggleBookmark }: PostCardProps) {
  const navigate = useNavigate();
  const image = getPostImage(post);
  const categories = getPostCategories(post);
  const authorName = useResolvedAuthor(post);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 120);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/artikel/${post.slug}`;
    const shareTitle = stripHtml(post.title.rendered);
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success("Link kopiert");
  };

  const BookmarkButton = () => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleBookmark?.(post.id);
      }}
      className="fiume-touch-target p-1.5 rounded-full transition-colors hover:bg-secondary"
      aria-label={isBookmarked ? "Lesezeichen entfernen" : "Lesezeichen hinzufügen"}
    >
      {isBookmarked ? (
        <BookmarkCheck size={18} className="text-accent" />
      ) : (
        <Bookmark size={18} className="text-muted-foreground" />
      )}
    </button>
  );

  const ActionButtons = () => (
    <div className="flex items-center gap-0.5">
      <button
        onClick={handleShare}
        className="fiume-touch-target p-1.5 rounded-full transition-colors hover:bg-secondary"
        aria-label="Teilen"
      >
        <Share2 size={16} className="text-muted-foreground" />
      </button>
      <BookmarkButton />
    </div>
  );

  if (variant === "hero") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative cursor-pointer group"
        onClick={() => navigate(`/artikel/${post.slug}`)}
      >
        {image && (
          <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm">
            <img
              src={image}
              alt={stripHtml(post.title.rendered)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              {categories[0] && (
                <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-accent-foreground bg-accent/90 px-2.5 py-0.5 rounded-sm">
                  {categories[0].name}
                </span>
              )}
              <h2
                className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mt-2 leading-snug text-white drop-shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">{excerpt}…</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {authorName && (
                    <>
                      <span className="text-white/60 text-[10px] sm:text-xs font-medium">
                        {authorName}
                      </span>
                      <span className="text-white/40 text-[10px]">·</span>
                    </>
                  )}
                  <time className="text-[10px] sm:text-xs text-white/50 tracking-wide uppercase">
                    {formatDate(post.date)}
                  </time>
                </div>
                <ActionButtons />
              </div>
            </div>
          </div>
        )}
        {!image && (
          <div className="p-5">
            {categories[0] && <span className="fiume-category">{categories[0].name}</span>}
            <h2
              className="font-serif text-2xl font-semibold mt-1 leading-snug"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{excerpt}…</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {authorName && (
                  <>
                    <span className="text-muted-foreground text-xs">{authorName}</span>
                    <span className="text-muted-foreground/40 text-[8px]">·</span>
                  </>
                )}
                <time className="text-xs text-muted-foreground tracking-wide uppercase">
                  {formatDate(post.date)}
                </time>
              </div>
              <ActionButtons />
            </div>
          </div>
        )}
      </motion.article>
    );
  }

  if (variant === "grid") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="cursor-pointer group"
        onClick={() => navigate(`/artikel/${post.slug}`)}
      >
        {image && (
          <div className="aspect-[4/3] overflow-hidden rounded-sm mb-2">
            <img
              src={image}
              alt={stripHtml(post.title.rendered)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        {categories[0] && <span className="fiume-category text-[9px]">{categories[0].name}</span>}
        <h3
          className="font-serif text-sm font-semibold mt-0.5 leading-snug line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground font-medium truncate">
            {authorName || "\u00A0"}
          </span>
          <ActionButtons />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 sm:gap-4 cursor-pointer py-3.5 border-b border-border active:bg-secondary/50 transition-colors"
      onClick={() => navigate(`/artikel/${post.slug}`)}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {categories[0] && <span className="fiume-category text-[10px]">{categories[0].name}</span>}
          <h3
            className="font-serif text-sm sm:text-base font-semibold mt-0.5 leading-snug line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2 min-w-0">
            {authorName && (
              <>
                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[100px]">
                  {authorName}
                </span>
                <span className="text-muted-foreground/40 text-[8px]">·</span>
              </>
            )}
            <time className="text-[10px] text-muted-foreground tracking-wide uppercase">
              {formatDate(post.date)}
            </time>
          </div>
          <ActionButtons />
        </div>
      </div>
      {image && (
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-sm">
          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
    </motion.article>
  );
}
