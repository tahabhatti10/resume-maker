import {
  ListChecks,
  Palette,
  Bot,
  Download,
  Smartphone,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Guided onboarding",
    desc: "A friendly step-by-step form captures everything a great resume needs.",
    color: "#2563eb",
  },
  {
    icon: Palette,
    title: "Professional templates",
    desc: "Switch layouts, colors and fonts instantly with a live preview.",
    color: "#7c3aed",
  },
  {
    icon: Bot,
    title: "AI assistant",
    desc: "Draft summaries, sharpen bullets, or import an existing resume file.",
    color: "#ec4899",
  },
  {
    icon: Smartphone,
    title: "Fully responsive",
    desc: "Every template looks sharp on phones, tablets and desktops.",
    color: "#0ea5e9",
  },
  {
    icon: Download,
    title: "Own your code",
    desc: "Export clean, standalone HTML you can host on any platform.",
    color: "#10b981",
  },
  {
    icon: Rocket,
    title: "One-click publish",
    desc: "Deploy to a live URL and share your site with the world.",
    color: "#f59e0b",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl tracking-tight">
          Everything you need to stand out
        </h2>
        <p className="mt-3 text-muted-foreground">
          From first draft to final export, Resumio handles the heavy lifting.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            style={{ boxShadow: `0 1px 0 0 ${f.color}00` }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${f.color}1a`, color: f.color }}
            >
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
