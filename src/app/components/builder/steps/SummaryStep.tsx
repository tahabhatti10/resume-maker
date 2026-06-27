import { Sparkles } from "lucide-react";
import { useBuilder } from "../../../state/BuilderContext";
import { LabeledTextarea } from "../fields/Fields";

export function SummaryStep() {
  const { resume, setSummary } = useBuilder();
  return (
    <div className="space-y-3">
      <LabeledTextarea
        label="Professional summary"
        value={resume.summary}
        onChange={setSummary}
        rows={6}
        placeholder="2–4 sentences on who you are, your strengths, and the impact you've made."
      />
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        Tip: open the AI assistant to draft this for you.
      </p>
    </div>
  );
}
