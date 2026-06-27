import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import { useEntitlement } from "../../state/EntitlementContext";
import { useUpgrade } from "./UpgradeModal";

interface ProGateProps {
  children: ReactNode;
  reason?: string;
  className?: string;
}

// Wraps content that requires Pro. Free users see a blurred preview with an
// unlock overlay.
export function ProGate({ children, reason, className = "" }: ProGateProps) {
  const { isPro } = useEntitlement();
  const { requestUpgrade } = useUpgrade();

  if (isPro) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 p-4 text-center backdrop-blur-[2px]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Lock className="h-5 w-5" />
        </span>
        <p className="max-w-xs text-sm text-muted-foreground">
          {reason ?? "This is a Pro feature."}
        </p>
        <Button size="sm" onClick={() => requestUpgrade(reason)}>
          Unlock with Pro
        </Button>
      </div>
    </div>
  );
}
