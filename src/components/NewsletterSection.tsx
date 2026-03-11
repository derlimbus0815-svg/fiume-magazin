import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder – replace with real endpoint later
    console.log("Newsletter signup:", email);
    toast.success("Vielen Dank! (Platzhalter – noch nicht verbunden)");
    setEmail("");
  };

  return (
    <section className="mx-3 sm:mx-4 my-6 border border-border rounded-sm p-5 sm:p-6 bg-secondary/30">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={18} className="text-accent" />
        <h3 className="font-serif text-base sm:text-lg font-semibold">Newsletter</h3>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
        Erhalte neue Artikel direkt in dein Postfach – kein Spam, jederzeit abbestellbar.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="flex-1 min-w-0 h-10 rounded-sm border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-sm bg-foreground text-background text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-foreground/90 transition-colors flex-shrink-0"
        >
          Abonnieren
        </button>
      </form>
    </section>
  );
}
