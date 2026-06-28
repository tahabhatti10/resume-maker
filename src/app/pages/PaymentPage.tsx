import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Navbar } from "../components/landing/Navbar";
import { Button } from "../components/ui/button";
import { Logo, BRAND_GRADIENT } from "../components/shared/Logo";
import { useEntitlement } from "../state/EntitlementContext";

const PRO_FEATURES = [
  "Premium templates & color systems",
  "Unlimited AI assistant & file imports",
  "Ad-free HTML and PDF exports",
  "Cancel anytime — keep your files",
];

function detectBrand(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Discover";
  return "";
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function PaymentPage() {
  const navigate = useNavigate();
  const { upgrade, isPro } = useEntitlement();
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  const brand = useMemo(() => detectBrand(card), [card]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      upgrade();
      setProcessing(false);
      confetti({ particleCount: 130, spread: 75, origin: { y: 0.6 } });
      toast.success("Welcome to Resumio Pro — everything is unlocked.");
      navigate("/builder");
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:py-16">
        <Link
          to="/pricing"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to pricing
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Summary */}
          <section className="order-2 lg:order-1">
            <div
              className="rounded-3xl p-8 text-white shadow-xl"
              style={{ background: BRAND_GRADIENT }}
            >
              <div className="flex items-center justify-between">
                <Logo markOnly />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> 7-day free trial
                </span>
              </div>
              <h1 className="mt-7 font-serif text-3xl leading-tight">
                Resumio Pro
              </h1>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-5xl font-bold">$9</span>
                <span className="mb-1.5 text-white/80">/month</span>
              </div>
              <ul className="mt-7 space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 space-y-2 rounded-2xl border border-border bg-card p-5">
              <Row label="Resumio Pro (monthly)" value="$9.00" />
              <Row label="7-day free trial" value="−$9.00" muted />
              <div className="my-2 border-t border-border" />
              <Row label="Due today" value="$0.00" bold />
              <p className="pt-1 text-xs text-muted-foreground">
                You won't be charged until your trial ends. Cancel anytime before
                then and pay nothing.
              </p>
            </div>
          </section>

          {/* Form */}
          <section className="order-1 lg:order-2">
            <form
              onSubmit={submit}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-semibold">Payment details</h2>
                  <p className="text-sm text-muted-foreground">
                    Demo checkout — no real payment is taken.
                  </p>
                </div>
              </div>

              {isPro && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  You're already on Pro 🎉 — no payment needed.
                </div>
              )}

              <div className="grid gap-4">
                <Field label="Cardholder name">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Maya Chen"
                  />
                </Field>

                <Field label="Card number">
                  <div className="relative">
                    <input
                      required
                      inputMode="numeric"
                      value={card}
                      onChange={(e) => setCard(formatCardNumber(e.target.value))}
                      className={`${inputCls} pr-20`}
                      placeholder="4242 4242 4242 4242"
                    />
                    {brand && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {brand}
                      </span>
                    )}
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Expiry">
                    <input
                      required
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className={inputCls}
                      placeholder="MM / YY"
                    />
                  </Field>
                  <Field label="CVC">
                    <input
                      required
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className={inputCls}
                      placeholder="123"
                    />
                  </Field>
                </div>

                <Field label="Billing ZIP">
                  <input
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className={inputCls}
                    placeholder="10001"
                  />
                </Field>
              </div>

              <Button
                size="lg"
                className="mt-7 w-full border-0 text-white"
                style={{ background: BRAND_GRADIENT }}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  "Start Pro trial"
                )}
              </Button>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Cancel anytime
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> No charge for 7 days
                </span>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between text-sm ${
        bold ? "font-semibold" : ""
      } ${muted ? "text-muted-foreground" : ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
