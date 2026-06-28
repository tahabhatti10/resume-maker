import { useNavigate } from "react-router";
import { templates } from "../../lib/templates";
import { sampleResume, defaultTheme } from "../../lib/sampleData";
import { ProBadge } from "../monetization/ProBadge";
import { Button } from "../ui/button";

const ACCENTS: Record<string, string> = {
  minimal: "#2563eb",
  modern: "#8b5cf6",
  sidebar: "#10b981",
  editorial: "#0f172a",
  compact: "#ec4899",
};

export function TemplateShowcase() {
  const navigate = useNavigate();
  return (
    <section id="templates" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl tracking-tight">
          Templates for every style
        </h2>
        <p className="mt-2 text-muted-foreground">
          Pick a starting point — you can customize everything later.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => {
          const Comp = t.Component;
          const theme = { ...defaultTheme, templateId: t.id, accent: ACCENTS[t.id] };
          return (
            <div
              key={t.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-64 overflow-hidden bg-muted/40">
                <div
                  style={{
                    width: 820,
                    transform: "scale(0.42)",
                    transformOrigin: "top left",
                    pointerEvents: "none",
                  }}
                >
                  <Comp data={sampleResume} theme={theme} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {t.name}
                    {t.tier === "pro" && <ProBadge />}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/builder")}
                >
                  Use
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
