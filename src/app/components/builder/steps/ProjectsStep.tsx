import { Plus, Trash2, FolderGit2 } from "lucide-react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { LabeledInput, LabeledTextarea } from "../fields/Fields";
import { EmptyHint } from "./ExperienceStep";

export function ProjectsStep() {
  const { resume, addProject, updateItem, removeItem } = useBuilder();

  return (
    <div className="space-y-4">
      {resume.projects.length === 0 && (
        <EmptyHint
          icon={<FolderGit2 className="h-5 w-5" />}
          text="Showcase side projects or notable work."
        />
      )}

      {resume.projects.map((p) => (
        <div key={p.id} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {p.name || "New project"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem("projects", p.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Project name"
              value={p.name}
              onChange={(v) => updateItem("projects", p.id, { name: v })}
              placeholder="Coral Design Kit"
            />
            <LabeledInput
              label="Link"
              value={p.link}
              onChange={(v) => updateItem("projects", p.id, { link: v })}
              placeholder="github.com/you/project"
            />
          </div>
          <div className="mt-3">
            <LabeledTextarea
              label="Description"
              value={p.description}
              rows={2}
              onChange={(v) => updateItem("projects", p.id, { description: v })}
              placeholder="What it is and the impact it had."
            />
          </div>
          <div className="mt-3 space-y-1.5">
            <Label>Tags (comma separated)</Label>
            <Input
              value={p.tags.join(", ")}
              placeholder="Open Source, Design System"
              onChange={(e) =>
                updateItem("projects", p.id, {
                  tags: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addProject} className="w-full">
        <Plus className="h-4 w-4" /> Add project
      </Button>
    </div>
  );
}
