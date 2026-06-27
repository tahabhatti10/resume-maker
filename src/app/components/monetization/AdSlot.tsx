import { useEntitlement } from "../../state/EntitlementContext";

interface AdSlotProps {
  label?: string;
  height?: number;
  className?: string;
}

// Placeholder ad unit. Hidden for Pro users. Swap the inner markup for a real
// AdSense / network embed in production.
export function AdSlot({ label = "Advertisement", height = 120, className = "" }: AdSlotProps) {
  const { isPro } = useEntitlement();
  if (isPro) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-center ${className}`}
      style={{ minHeight: height }}
    >
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 text-xs text-muted-foreground/70">
        Go Pro to remove ads
      </span>
    </div>
  );
}
