import { Moon, Sun, FileText, Shield, Bookmark } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { isDark, toggle } = useDarkMode();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();

  return (
    <div className="fiume-safe-bottom">
      <header className="py-4 sm:py-5 text-center border-b border-border">
        <h1 className="fiume-heading text-xl sm:text-2xl">Profil</h1>
      </header>

      <div className="px-4 py-5 sm:py-6">
        {/* Placeholder for auth */}
        <div className="bg-card rounded-lg p-5 sm:p-6 text-center border border-border mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary mx-auto mb-3 flex items-center justify-center">
            <span className="font-serif text-xl sm:text-2xl text-muted-foreground">G</span>
          </div>
          <p className="font-serif text-base sm:text-lg font-semibold">Gast</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Anmelden, um Kommentare zu schreiben und Artikel zu speichern.
          </p>
          <button className="mt-4 h-10 sm:h-11 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium active:opacity-80 transition-opacity">
            Anmelden
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-0.5">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-medium flex-1 text-left">
              {isDark ? "Heller Modus" : "Dunkler Modus"}
            </span>
          </button>

          <button
            onClick={() => navigate("/lesezeichen")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            <Bookmark size={20} />
            <span className="text-sm font-medium flex-1 text-left">Lesezeichen</span>
            {bookmarks.length > 0 && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/impressum")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            <FileText size={20} />
            <span className="text-sm font-medium flex-1 text-left">Impressum</span>
          </button>

          <button
            onClick={() => navigate("/datenschutz")}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg hover:bg-secondary active:bg-secondary/80 transition-colors"
          >
            <Shield size={20} />
            <span className="text-sm font-medium flex-1 text-left">Datenschutz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
