import { useState, useEffect } from "react";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fiume_consent")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem("fiume_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("fiume_consent", "declined");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-[60] p-4 animate-slide-up">
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-lg mx-auto">
        <p className="text-sm leading-relaxed">
          Wir verwenden Cookies und lokale Speicherung, um Ihr Erlebnis zu verbessern.{" "}
          <a href="/datenschutz" className="text-accent underline">
            Datenschutzerklärung
          </a>
        </p>
        <div className="flex gap-3 mt-3">
          <button
            onClick={accept}
            className="fiume-touch-target flex-1 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Akzeptieren
          </button>
          <button
            onClick={decline}
            className="fiume-touch-target flex-1 border border-border rounded-md text-sm font-medium"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}
