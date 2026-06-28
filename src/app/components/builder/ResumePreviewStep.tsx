import { Eye } from "lucide-react";
import { LivePreview } from "./LivePreview";
import { getTemplate } from "../../lib/templates";
import { useBuilder } from "../../state/BuilderContext";

export function ResumePreviewStep() {
  const { theme } = useBuilder();
  const template = getTemplate(theme.templateId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Review your complete resume</h2>
          <p className="text-sm text-muted-foreground">
            Scroll through the full resume. If anything feels off, jump back to a
            section and edit it — then continue to Export.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Eye className="h-3.5 w-3.5" /> {template.name} template
        </span>
      </div>
      <div className="h-[72vh] overflow-hidden rounded-2xl border border-border bg-muted/40 p-2">
        <LivePreview />
      </div>
    </div>
  );
}
