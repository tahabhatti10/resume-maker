import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Tier } from "../lib/types";

const STORAGE_KEY = "resume-maker:tier";

interface EntitlementValue {
  tier: Tier;
  isPro: boolean;
  upgrade: () => void;
  downgrade: () => void;
}

const EntitlementContext = createContext<EntitlementValue | null>(null);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as Tier) || "free";
    } catch {
      return "free";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, tier);
    } catch {
      // ignore
    }
  }, [tier]);

  // In a real build, upgrade() would hit Stripe + verify via Supabase webhook.
  const upgrade = useCallback(() => setTier("pro"), []);
  const downgrade = useCallback(() => setTier("free"), []);

  const value = useMemo<EntitlementValue>(
    () => ({ tier, isPro: tier === "pro", upgrade, downgrade }),
    [tier, upgrade, downgrade],
  );

  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement(): EntitlementValue {
  const ctx = useContext(EntitlementContext);
  if (!ctx)
    throw new Error("useEntitlement must be used within EntitlementProvider");
  return ctx;
}
