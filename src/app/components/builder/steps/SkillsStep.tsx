import { Plus, Trash2, Wrench } from "lucide-react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { LabeledInput } from "../fields/Fields";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { EmptyHint } from "./ExperienceStep";

export function SkillsStep() {
  const { resume, addSkill, updateItem, removeItem } = useBuilder();

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
              <Label>Skills (comma separated)</Label>
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
