import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Textarea } from "../../ui/textarea";
import { LabeledInput } from "../fields/Fields";
import { generateWithGroq } from "../../../../lib/groq";

export function ExperienceStep() {
  const { resume, addExperience, updateItem, removeItem } = useBuilder();
  const [loadingExperienceId, setLoadingExperienceId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {resume.experience.length === 0 && (
        <EmptyHint
          icon={<Briefcase className="h-5 w-5" />}
          text="No roles yet. Add your work history."
        />
      )}

      {resume.experience.map((e) => (
        <div key={e.id} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {e.role || e.company || "New role"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem("experience", e.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Role"
              value={e.role}
              onChange={(v) => updateItem("experience", e.id, { role: v })}
              placeholder="Senior Designer"
              aiPrompt="Suggest a polished professional job title for this experience entry."
            />
            <LabeledInput
              label="Company"
              value={e.company}
              onChange={(v) => updateItem("experience", e.id, { company: v })}
              placeholder="Acme Inc."
            />
            <LabeledInput
              label="Location"
              value={e.location}
              onChange={(v) => updateItem("experience", e.id, { location: v })}
              placeholder="Remote"
            />
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                label="Start"
                value={e.start}
                onChange={(v) => updateItem("experience", e.id, { start: v })}
                placeholder="2021"
              />
              <LabeledInput
                label="End"
                value={e.current ? "" : e.end}
                onChange={(v) => updateItem("experience", e.id, { end: v })}
                placeholder="2024"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Switch
              checked={e.current}
              onCheckedChange={(v) =>
                updateItem("experience", e.id, { current: v })
              }
            />
            <Label className="text-sm">I currently work here</Label>
          </div>
          <div className="mt-3 space-y-1.5">
            <Label>Highlights (one per line)</Label>
            <Textarea
              rows={4}
              value={e.bullets.join("\n")}
              placeholder={"Led X that improved Y by Z%\nBuilt X used by N people"}
              onChange={(ev) =>
                updateItem("experience", e.id, {
                  bullets: ev.target.value.split("\n"),
                })
              }
            />
            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled={loadingExperienceId === e.id}
                onClick={async () => {
                  setLoadingExperienceId(e.id);
                  const suggestion = await generateWithGroq(`Rewrite this work experience into strong resume bullet points. Keep them concise, measurable, and achievement-focused.\n\nCurrent details: ${e.role} at ${e.company}. ${e.bullets.join(" ")}`);
                  updateItem("experience", e.id, { bullets: suggestion.split(/\n|\r\n/).map((line) => line.replace(/^[-•]\s*/, "")).filter(Boolean) });
                  setLoadingExperienceId(null);
                }}
              >
                {loadingExperienceId === e.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                AI Suggest ✨
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4" /> Add role
      </Button>
    </div>
  );
}

export function EmptyHint({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center text-muted-foreground">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
