import { RefreshCw } from "lucide-react";

export default function ErrorScreen({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
      <p className="font-serif text-xl">Etwas ist schiefgelaufen</p>
      <p className="text-sm text-muted-foreground">{message || "Bitte versuche es erneut."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="fiume-touch-target gap-2 text-sm font-medium text-accent"
        >
          <RefreshCw size={16} />
          Erneut versuchen
        </button>
      )}
    </div>
  );
}
