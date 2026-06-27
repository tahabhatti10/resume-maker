import { Check } from "lucide-react";
import { useBuilder } from "../../state/BuilderContext";
import { useEntitlement } from "../../state/EntitlementContext";
import { useUpgrade } from "../monetization/UpgradeModal";
import { templates } from "../../lib/templates";
import { ProBadge } from "../monetization/ProBadge";
import { Label } from "../ui/label";
import type { FontChoice, DensityChoice } from "../../lib/types";

const ACCENTS = [
  "#2563eb",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#0f172a",
];

const FONTS: { id: FontChoice; label: string }[] = [
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
];

const DENSITIES: { id: DensityChoice; label: string }[] = [
  { id: "comfortable", label: "Comfortable" },
  { id: "compact", label: "Compact" },
];

export function DesignStep() {
  const { theme, setTheme } = useBuilder();
  const { isPro } = useEntitlement();
  const { requestUpgrade } = useUpgrade();

  const pickTemplate = (id: string, tier: string) => {
    if (tier === "pro" && !isPro) {
      requestUpgrade("This template is part of Resumio Pro.");
      return;
    }
    setTheme({ templateId: id });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Template</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {templates.map((t) => {
            const selected = theme.templateId === t.id;
            const locked = t.tier === "pro" && !isPro;
            return (
              <button
                key={t.id}
                onClick={() => pickTemplate(t.id, t.tier)}
                className={`relative rounded-xl border p-3 text-left transition ${
                  selected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{t.name}</span>
                  {t.tier === "pro" && <ProBadge />}
                </div>
                <TemplateThumb id={t.id} accent={theme.accent} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {t.description}
                </p>
                {selected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                {locked && (
                  <span className="absolute inset-0 rounded-xl bg-background/10" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Accent color</Label>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => setTheme({ accent: c })}
              className={`h-8 w-8 rounded-full transition ${
                theme.accent === c ? "ring-2 ring-offset-2 ring-foreground/40" : ""
              }`}
              style={{ background: c }}
              aria-label={`accent ${c}`}
            />
          ))}
          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border">
            <input
              type="color"
              value={theme.accent}
              onChange={(e) => setTheme({ accent: e.target.value })}
              className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="mb-3 block">Font</Label>
          <div className="flex gap-2">
            {FONTS.map((f) => (
              <Segment
                key={f.id}
                active={theme.font === f.id}
                onClick={() => setTheme({ font: f.id })}
              >
                {f.label}
              </Segment>
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-3 block">Density</Label>
          <div className="flex gap-2">
            {DENSITIES.map((d) => (
              <Segment
                key={d.id}
                active={theme.density === d.id}
                onClick={() => setTheme({ density: d.id })}
              >
                {d.label}
              </Segment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

// Tiny abstract thumbnail of each layout.
function TemplateThumb({ id, accent }: { id: string; accent: string }) {
  const bar = (w: string, c = "#d4d4d8") => (
    <div style={{ height: 4, width: w, background: c, borderRadius: 2 }} />
  );
  if (id === "sidebar") {
    return (
      <div className="flex h-20 overflow-hidden rounded-md border border-border">
        <div style={{ width: "34%", background: accent }} />
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          {bar("70%")}
          {bar("90%")}
          {bar("60%")}
        </div>
      </div>
    );
  }
  if (id === "modern") {
    return (
      <div className="h-20 overflow-hidden rounded-md border border-border">
        <div style={{ height: "38%", background: accent }} />
        <div className="flex flex-col gap-1.5 p-2">
          {bar("80%")}
          {bar("60%")}
        </div>
      </div>
    );
  }
  if (id === "editorial") {
    return (
      <div className="flex h-20 flex-col items-center gap-1.5 rounded-md border border-border p-2">
        {bar("50%", accent)}
        <div style={{ height: 1, width: "70%", background: accent }} />
        {bar("80%")}
        {bar("65%")}
      </div>
    );
  }
  if (id === "compact") {
    return (
      <div className="h-20 overflow-hidden rounded-md border border-border p-2">
        <div style={{ height: 4, width: "60%", background: accent, borderRadius: 2 }} />
        <div className="mt-1.5 flex gap-2">
          <div className="flex flex-1 flex-col gap-1">
            {bar("90%")}
            {bar("80%")}
            {bar("85%")}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            {bar("70%")}
            {bar("60%")}
          </div>
        </div>
      </div>
    );
  }
  // minimal
  return (
    <div className="flex h-20 flex-col gap-1.5 rounded-md border border-border p-2">
      {bar("55%", accent)}
      {bar("85%")}
      {bar("70%")}
      {bar("78%")}
    </div>
  );
}
