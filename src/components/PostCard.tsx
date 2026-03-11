import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { type WPPost, getPostImage, getPostCategories, stripHtml, formatDate } from "@/lib/wp-api";

interface PostCardProps {
  post: WPPost;
  variant?: "hero" | "compact";
}

export default function PostCard({ post, variant = "compact" }: PostCardProps) {
  const navigate = useNavigate();
  const image = getPostImage(post);
  const categories = getPostCategories(post);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 120);

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
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img
              src={image}
              alt={stripHtml(post.title.rendered)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="mt-4">
          {categories[0] && <span className="fiume-category">{categories[0].name}</span>}
          <h2
            className="font-serif text-2xl font-semibold mt-1 leading-snug"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{excerpt}…</p>
          <time className="text-xs text-muted-foreground mt-2 block tracking-wide uppercase">
            {formatDate(post.date)}
          </time>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 cursor-pointer py-4 border-b border-border"
      onClick={() => navigate(`/artikel/${post.slug}`)}
    >
      <div className="flex-1 min-w-0">
        {categories[0] && <span className="fiume-category text-[10px]">{categories[0].name}</span>}
        <h3
          className="font-serif text-base font-semibold mt-0.5 leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <time className="text-[10px] text-muted-foreground mt-1 block tracking-wide uppercase">
          {formatDate(post.date)}
        </time>
      </div>
      {image && (
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm">
          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
    </motion.article>
  );
}
