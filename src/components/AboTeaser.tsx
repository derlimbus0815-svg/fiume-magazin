import { Sparkles } from "lucide-react";

export default function AboTeaser() {
  return (
    <section className="mx-3 sm:mx-4 my-6 border border-accent/40 rounded-sm p-5 sm:p-6 bg-accent/5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={18} className="text-accent" />
        <h3 className="font-serif text-base sm:text-lg font-semibold">FIUME unterstützen</h3>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
        Unterstütze unabhängigen Journalismus und Kultur – mit einem Abo erhältst du Zugang zu exklusiven Inhalten und förderst freie Publizistik.
      </p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          console.log("Abo CTA clicked – placeholder");
        }}
        className="inline-block h-10 px-5 leading-10 rounded-sm bg-accent text-accent-foreground text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-accent/90 transition-colors"
      >
        Jetzt abonnieren
      </a>
    </section>
  );
}
