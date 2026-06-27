import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useEntitlement } from "../../state/EntitlementContext";
import { useUpgrade } from "../monetization/UpgradeModal";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    cta: "Start free",
    pro: false,
    features: [
      "3 professional templates",
      "Live preview & customization",
      "Download standalone HTML",
      "Supported by ads",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    cta: "Go Pro",
    pro: true,
    features: [
      "Everything in Free",
      "All premium templates",
      "Unlimited AI assistant + imports",
      "Ad-free & one-click deploy",
    ],
  },
];

export function PricingTeaser() {
  const navigate = useNavigate();
  const { isPro } = useEntitlement();
  const { requestUpgrade } = useUpgrade();

  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Simple, honest pricing
        </h2>
        <p className="mt-2 text-muted-foreground">
          Start free. Upgrade when you want more power.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-7 ${
              p.pro
                ? "border-primary bg-card shadow-lg"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.pro && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                  Most popular
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-semibold">{p.price}</span>
              <span className="text-muted-foreground">/{p.period}</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={p.pro ? "default" : "outline"}
              onClick={() =>
                p.pro ? requestUpgrade() : navigate("/builder")
              }
              disabled={p.pro && isPro}
            >
              {p.pro && isPro ? "Current plan" : p.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
