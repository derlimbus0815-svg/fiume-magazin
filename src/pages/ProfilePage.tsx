import { Moon, Sun, FileText, Shield } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className="fiume-safe-bottom">
      <header className="py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-2xl">Profil</h1>
      </header>

      <div className="px-4 py-6">
        {/* Placeholder for auth */}
        <div className="bg-card rounded-lg p-6 text-center border border-border mb-6">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
            <span className="font-serif text-2xl text-muted-foreground">G</span>
          </div>
          <p className="font-serif text-lg font-semibold">Gast</p>
          <p className="text-sm text-muted-foreground mt-1">
            Anmelden, um Kommentare zu schreiben und Artikel zu speichern.
          </p>
          <button className="mt-4 h-11 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Anmelden
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-1">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-medium flex-1 text-left">
              {isDark ? "Heller Modus" : "Dunkler Modus"}
            </span>
          </button>

          <button
            onClick={() => navigate("/impressum")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            <FileText size={20} />
            <span className="text-sm font-medium flex-1 text-left">Impressum</span>
          </button>

          <button
            onClick={() => navigate("/datenschutz")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            <Shield size={20} />
            <span className="text-sm font-medium flex-1 text-left">Datenschutz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
