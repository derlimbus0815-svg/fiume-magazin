export default function LoadingSpinner({ text = "Laden…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
