import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ImpressumPage() {
  const navigate = useNavigate();

  return (
    <div className="fiume-safe-bottom">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-12 px-4 gap-3">
          <button onClick={() => navigate(-1)} className="fiume-touch-target">
            <ArrowLeft size={22} />
          </button>
          <h1 className="fiume-heading text-sm">Impressum</h1>
        </div>
      </div>

      <div className="px-5 py-8 fiume-article-body text-base">
        <h2 className="font-serif text-2xl font-bold mb-4">Impressum</h2>
        <p>FIUME Magazin</p>
        <p className="mt-4">Angaben gemäß § 5 TMG:</p>
        <p className="mt-2">[Name / Firma]<br />[Adresse]<br />[PLZ, Ort]</p>
        <p className="mt-4"><strong>Kontakt:</strong><br />E-Mail: kontakt@fiume-magazin.com</p>
        <p className="mt-4"><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />[Name, Adresse]</p>
        <p className="mt-6 text-sm text-muted-foreground">
          Diese Platzhalter-Texte müssen durch die tatsächlichen Angaben ersetzt werden.
        </p>
      </div>
    </div>
  );
}
