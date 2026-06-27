import { Crown } from "lucide-react";

export function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 ${className}`}
      style={{ fontSize: 11 }}
    >
      <Crown className="h-3 w-3" />
      PRO
    </span>
  );
}
