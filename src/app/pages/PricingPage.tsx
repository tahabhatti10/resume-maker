import { Navbar } from "../components/landing/Navbar";
import { PricingTeaser } from "../components/landing/PricingTeaser";
import { Footer } from "../components/landing/Footer";

const FAQS = [
  {
    q: "Can I use Resumio for free?",
    a: "Yes. The free plan includes three templates, live customization, and HTML export. It's ad-supported.",
  },
  {
    q: "What do I get with Pro?",
    a: "All premium templates, an unlimited AI assistant with file imports, an ad-free experience, and one-click deploy.",
  },
  {
    q: "Do I own my resume website?",
    a: "Absolutely. Export the standalone HTML and host it anywhere — there's no lock-in.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel in one click. Your downloaded sites are yours to keep forever.",
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PricingTeaser />
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
