import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DatenschutzPage() {
  const navigate = useNavigate();

  return (
    <div className="fiume-safe-bottom">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-12 px-4 gap-3">
          <button onClick={() => navigate(-1)} className="fiume-touch-target">
            <ArrowLeft size={22} />
          </button>
          <h1 className="fiume-heading text-sm">Datenschutz</h1>
        </div>
      </div>

      <div className="px-5 py-8 fiume-article-body text-base">
        <h2 className="font-serif text-2xl font-bold mb-4">Datenschutzerklärung</h2>
        <h3 className="font-serif text-lg font-semibold mt-6 mb-2">1. Datenschutz auf einen Blick</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese App nutzen.</p>

        <h3 className="font-serif text-lg font-semibold mt-6 mb-2">2. Datenerfassung in dieser App</h3>
        <p>Die App speichert lokale Daten (Einstellungen, Cache) auf Ihrem Gerät. Bei Erstellung eines Benutzerkontos werden E-Mail und Name gespeichert.</p>

        <h3 className="font-serif text-lg font-semibold mt-6 mb-2">3. Ihre Rechte</h3>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter kontakt@fiume-magazin.com.</p>

        <h3 className="font-serif text-lg font-semibold mt-6 mb-2">4. Cookies & lokale Speicherung</h3>
        <p>Diese App verwendet localStorage zur Zwischenspeicherung von Artikeln und Einstellungen. Sie können diese Daten jederzeit in Ihren Browsereinstellungen löschen.</p>

        <p className="mt-6 text-sm text-muted-foreground">
          Diese Platzhalter-Texte müssen durch die tatsächlichen Datenschutzangaben ersetzt werden.
        </p>
      </div>
    </div>
  );
}
