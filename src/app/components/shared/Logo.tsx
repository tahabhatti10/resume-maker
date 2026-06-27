import { FileText } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <FileText className="h-4 w-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight">Resumio</span>
    </span>
  );
}
