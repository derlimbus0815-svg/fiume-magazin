import { useState } from "react";
import { Search } from "lucide-react";
import { useWPSearch } from "@/hooks/use-wp-posts";
import PostCard from "@/components/PostCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useWPSearch(query);

  return (
    <div className="fiume-safe-bottom">
      <header className="py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-2xl">Suche</h1>
      </header>

      <div className="px-4 py-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artikel suchen…"
            className="w-full h-12 pl-10 pr-4 bg-secondary rounded-lg text-sm font-sans outline-none focus:ring-2 ring-accent/30 transition-shadow"
          />
        </div>
      </div>

      <section className="px-4">
        {isLoading && <LoadingSpinner text="Suche…" />}
        {query.length >= 2 && results && results.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">
            Keine Ergebnisse für „{query}"
          </p>
        )}
        {results?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {query.length < 2 && (
          <p className="text-center text-muted-foreground py-12 text-sm">
            Mindestens 2 Zeichen eingeben
          </p>
        )}
      </section>
    </div>
  );
}
