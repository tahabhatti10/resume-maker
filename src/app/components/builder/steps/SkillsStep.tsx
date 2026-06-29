import { Plus, Trash2, Wrench, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { LabeledInput } from "../fields/Fields";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { EmptyHint } from "./ExperienceStep";
import { generateWithGroq } from "../../../../lib/groq";

export function SkillsStep() {
  const { resume, addSkill, updateItem, removeItem } = useBuilder();
  const [loadingSkillId, setLoadingSkillId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {resume.skills.length === 0 && (
        <EmptyHint
          icon={<Wrench className="h-5 w-5" />}
          text="Group your skills by category."
        />
      )}

      {resume.skills.map((g) => (
        <div key={g.id} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {g.category || "New group"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem("skills", g.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Category"
              value={g.category}
              onChange={(v) => updateItem("skills", g.id, { category: v })}
              placeholder="Design"
            />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>Skills (comma separated)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={loadingSkillId === g.id}
                  onClick={async () => {
                    setLoadingSkillId(g.id);
                    const suggestion = await generateWithGroq(`Expand and professionalize this skills list for a resume. Return a polished comma-separated list of skills.\n\nCurrent text: ${g.items.join(", ")}`);
                    updateItem("skills", g.id, { items: suggestion.split(",").map((s) => s.trim()).filter(Boolean) });
                    setLoadingSkillId(null);
                  }}
                >
                  {loadingSkillId === g.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  AI Suggest ✨
                </Button>
              </div>
              <Input
                value={g.items.join(", ")}
                placeholder="Figma, Prototyping, Research"
                onChange={(e) =>
                  updateItem("skills", g.id, {
                    items: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addSkill} className="w-full">
        <Plus className="h-4 w-4" /> Add skill group
      </Button>
    </div>
  );
}
