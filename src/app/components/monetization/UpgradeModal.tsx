import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Check, Crown, CreditCard, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEntitlement } from "../../state/EntitlementContext";

interface UpgradeContextValue {
  requestUpgrade: (reason?: string) => void;
}
const UpgradeContext = createContext<UpgradeContextValue | null>(null);

const PRO_FEATURES = [
  "All premium templates (Editorial, Compact)",
  "Unlimited AI assistant + file imports",
  "Remove all ads",
  "One-click deploy & custom domain",
  "Priority export formats",
];

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const [processing, setProcessing] = useState(false);
  const { upgrade, isPro } = useEntitlement();

  const requestUpgrade = useCallback(
    (r?: string) => {
      if (isPro) {
        toast.success("You're already on Pro 🎉");
        return;
      }
      setReason(r);
      setOpen(true);
    },
    [isPro],
  );

  // Mock checkout — replace with Stripe Checkout redirect in production.
  const handleCheckout = useCallback(() => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOpen(false);
      upgrade();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      toast.success("Welcome to Pro! Everything is unlocked.");
    }, 1400);
  }, [upgrade]);

  const value = useMemo(() => ({ requestUpgrade }), [requestUpgrade]);

  return (
    <UpgradeContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Crown className="h-6 w-6" />
            </div>
            <DialogTitle>Upgrade to Resumio Pro</DialogTitle>
            <DialogDescription>
              {reason ?? "Unlock every template, the AI assistant, and ad-free exports."}
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 flex items-baseline gap-1">
            <span className="text-3xl font-semibold">$9</span>
            <span className="text-muted-foreground">/month</span>
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              7-day free trial
            </span>
          </div>

          <ul className="space-y-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" /> Start free trial
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo checkout — no real payment is taken.
          </p>
        </DialogContent>
      </Dialog>
    </UpgradeContext.Provider>
  );
}

export function useUpgrade(): UpgradeContextValue {
  const ctx = useContext(UpgradeContext);
  if (!ctx) throw new Error("useUpgrade must be used within UpgradeProvider");
  return ctx;
}
