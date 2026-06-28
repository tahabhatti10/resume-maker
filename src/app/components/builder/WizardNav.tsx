import { Check } from "lucide-react";
import { wizardSteps } from "./wizardSteps";
import { BRAND_GRADIENT } from "../shared/Logo";

const GROUPS: { title: string; ids: string[] }[] = [
  {
    title: "Your details",
    ids: ["contact", "summary", "experience", "education", "skills", "projects", "links"],
  },
  { title: "Customize", ids: ["design"] },
  { title: "Finish", ids: ["preview", "export"] },
];

export function WizardNav({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav className="flex gap-3 overflow-x-auto lg:flex-col lg:gap-5 lg:overflow-visible">
      {GROUPS.map((group) => (
        <div key={group.title} className="flex flex-shrink-0 gap-1 lg:flex-col lg:gap-0.5">
          <p className="hidden px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">
            {group.title}
          </p>
          {group.ids.map((id) => {
            const i = wizardSteps.findIndex((s) => s.id === id);
            if (i === -1) return null;
            const s = wizardSteps[i];
            const Icon = s.icon;
            const active = i === current;
            const done = i < current;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(i)}
                className={`flex flex-shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                style={active ? { background: BRAND_GRADIENT } : undefined}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    active
                      ? "bg-white/25"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted"
                  }`}
                >
                  {done && !active ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
