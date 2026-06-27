import { Check } from "lucide-react";
import { wizardSteps } from "./wizardSteps";

export function WizardNav({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
      {wizardSteps.map((s, i) => {
        const Icon = s.icon;
        const active = i === current;
        const done = i < current;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(i)}
            className={`flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                active
                  ? "bg-primary-foreground/20"
                  : done
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-muted"
              }`}
            >
              {done && !active ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </span>
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
