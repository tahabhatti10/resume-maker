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
const PDF_KEY = "resume-maker:pdfExports";

/** Free users get this many PDF exports before Pro is required. */
export const FREE_PDF_LIMIT = 3;

interface EntitlementValue {
  tier: Tier;
  isPro: boolean;
  upgrade: () => void;
  downgrade: () => void;
  pdfExportsUsed: number;
  pdfExportsLeft: number;
  /** True if the user may export a PDF right now (Pro, or free quota remaining). */
  canExportPdf: boolean;
  /** Records one free PDF export. No-op for Pro users. */
  recordPdfExport: () => void;
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

  const [pdfExportsUsed, setPdfExportsUsed] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(PDF_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, tier);
    } catch {
      // ignore
    }
  }, [tier]);

  useEffect(() => {
    try {
      localStorage.setItem(PDF_KEY, String(pdfExportsUsed));
    } catch {
      // ignore
    }
  }, [pdfExportsUsed]);

  // In a real build, upgrade() would hit Stripe + verify via Supabase webhook.
  const upgrade = useCallback(() => setTier("pro"), []);
  const downgrade = useCallback(() => setTier("free"), []);

  const isPro = tier === "pro";
  const pdfExportsLeft = Math.max(0, FREE_PDF_LIMIT - pdfExportsUsed);
  const canExportPdf = isPro || pdfExportsLeft > 0;

  const recordPdfExport = useCallback(() => {
    if (isPro) return; // Pro users don't consume quota
    setPdfExportsUsed((n) => n + 1);
  }, [isPro]);

  const value = useMemo<EntitlementValue>(
    () => ({
      tier,
      isPro,
      upgrade,
      downgrade,
      pdfExportsUsed,
      pdfExportsLeft,
      canExportPdf,
      recordPdfExport,
    }),
    [
      tier,
      isPro,
      upgrade,
      downgrade,
      pdfExportsUsed,
      pdfExportsLeft,
      canExportPdf,
      recordPdfExport,
    ],
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
