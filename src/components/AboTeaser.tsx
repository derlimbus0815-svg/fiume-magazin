import { Newspaper } from "lucide-react";

export default function AboTeaser() {
  return (
    <section className="mx-3 sm:mx-4 my-6 border border-border rounded-sm p-5 sm:p-6 bg-secondary/30">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper size={18} className="text-accent" />
        <h3 className="font-serif text-base sm:text-lg font-semibold">FIUME Print abonnieren</h3>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
        Mit einem Abonnement der FIUME-Printausgabe fördern Sie Kultur, Tradition und unabhängige Publizistik – und erhalten ausgewählte Texte in gedruckter Form.
      </p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          console.log("Abo CTA clicked – placeholder");
        }}
        className="inline-flex items-center justify-center h-10 px-5 rounded-sm bg-foreground text-background text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-foreground/90 transition-colors"
      >
        Jetzt abonnieren
      </a>
    </section>
  );
}
