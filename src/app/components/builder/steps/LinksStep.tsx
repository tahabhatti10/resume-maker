import { Plus, Trash2, LinkIcon } from "lucide-react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { LabeledInput } from "../fields/Fields";
import { EmptyHint } from "./ExperienceStep";

export function LinksStep() {
  const { resume, addLink, updateItem, removeItem } = useBuilder();

  return (
    <div className="space-y-4">
      {resume.links.length === 0 && (
        <EmptyHint
          icon={<LinkIcon className="h-5 w-5" />}
          text="Add LinkedIn, GitHub, portfolio, etc."
        />
      )}

      {resume.links.map((l) => (
        <div
          key={l.id}
          className="flex items-end gap-3 rounded-xl border border-border p-4"
        >
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Label"
              value={l.label}
              onChange={(v) => updateItem("links", l.id, { label: v })}
              placeholder="LinkedIn"
            />
            <LabeledInput
              label="URL"
              value={l.url}
              onChange={(v) => updateItem("links", l.id, { url: v })}
              placeholder="linkedin.com/in/you"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem("links", l.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addLink} className="w-full">
        <Plus className="h-4 w-4" /> Add link
      </Button>
    </div>
  );
}
