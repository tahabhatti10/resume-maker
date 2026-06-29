import { Plus, Trash2, GraduationCap } from "lucide-react";
import { useBuilder } from "../../../state/BuilderContext";
import { Button } from "../../ui/button";
import { LabeledInput, LabeledTextarea } from "../fields/Fields";
import { EmptyHint } from "./ExperienceStep";

export function EducationStep() {
  const { resume, addEducation, updateItem, removeItem } = useBuilder();

  return (
    <div className="space-y-4">
      {resume.education.length === 0 && (
        <EmptyHint
          icon={<GraduationCap className="h-5 w-5" />}
          text="Add your degrees, certifications or courses."
        />
      )}

      {resume.education.map((ed) => (
        <div key={ed.id} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {ed.school || "New entry"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem("education", ed.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <LabeledInput
              label="School"
              value={ed.school}
              onChange={(v) => updateItem("education", ed.id, { school: v })}
              placeholder="State University"
            />
            <LabeledInput
              label="Degree"
              value={ed.degree}
              onChange={(v) => updateItem("education", ed.id, { degree: v })}
              placeholder="BSc"
            />
            <LabeledInput
              label="Field of study"
              value={ed.field}
              onChange={(v) => updateItem("education", ed.id, { field: v })}
              placeholder="Computer Science"
            />
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                label="Start"
                value={ed.start}
                onChange={(v) => updateItem("education", ed.id, { start: v })}
                placeholder="2014"
              />
              <LabeledInput
                label="End"
                value={ed.end}
                onChange={(v) => updateItem("education", ed.id, { end: v })}
                placeholder="2018"
              />
            </div>
          </div>
          <div className="mt-3">
            <LabeledTextarea
              label="Details (optional)"
              value={ed.details}
              rows={2}
              onChange={(v) => updateItem("education", ed.id, { details: v })}
              placeholder="Honors, GPA, relevant coursework…"
              aiPrompt="Turn this education entry into polished resume-friendly details. Keep it concise and professional."
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4" /> Add education
      </Button>
    </div>
  );
}
