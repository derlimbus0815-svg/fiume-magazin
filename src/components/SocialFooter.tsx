import { Instagram, Youtube } from "lucide-react";

export default function SocialFooter() {
  return (
    <footer className="border-t border-border py-8 px-4 text-center">
      <p className="fiume-heading text-2xl mb-4">FIUME</p>
      <div className="flex justify-center gap-6 mb-4">
        <a
          href="https://instagram.com/fiumemagazin"
          target="_blank"
          rel="noopener noreferrer"
          className="fiume-touch-target text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={22} />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="fiume-touch-target text-muted-foreground hover:text-foreground transition-colors"
          aria-label="X"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="fiume-touch-target text-muted-foreground hover:text-foreground transition-colors"
          aria-label="YouTube"
        >
          <Youtube size={22} />
        </a>
      </div>
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
        <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
      </div>
      <p className="text-xs text-muted-foreground mt-3">© {new Date().getFullYear()} FIUME Magazin</p>
    </footer>
  );
}
