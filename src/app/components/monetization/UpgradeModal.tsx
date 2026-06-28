import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useEntitlement } from "../../state/EntitlementContext";

interface UpgradeContextValue {
  requestUpgrade: (reason?: string) => void;
}
const UpgradeContext = createContext<UpgradeContextValue | null>(null);

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const { isPro } = useEntitlement();

  const requestUpgrade = useCallback((_reason?: string) => {
    if (isPro) {
      toast.success("You're already on Pro 🎉");
      return;
    }
    window.location.href = "/payment";
  }, [isPro]);

  const value = useMemo(() => ({ requestUpgrade }), [requestUpgrade]);

  return <UpgradeContext.Provider value={value}>{children}</UpgradeContext.Provider>;
}

export function useUpgrade(): UpgradeContextValue {
  const ctx = useContext(UpgradeContext);
  if (!ctx) throw new Error("useUpgrade must be used within UpgradeProvider");
  return ctx;
}
