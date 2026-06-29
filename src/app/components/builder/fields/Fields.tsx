import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { generateWithGroq } from "../../../../lib/groq";

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  aiPrompt?: string;
}

export function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  aiPrompt,
}: LabeledInputProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAiSuggest = async () => {
    if (!aiPrompt) return;
    setIsLoading(true);
    const suggestion = await generateWithGroq(`${aiPrompt}\n\nCurrent text: ${value || ""}`);
    onChange(suggestion);
    setIsLoading(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {aiPrompt && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAiSuggest}
            disabled={isLoading}
            className="h-7 px-2 text-xs"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            AI Suggest ✨
          </Button>
        )}
      </div>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface LabeledTextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  aiPrompt?: string;
}

export function LabeledTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  aiPrompt,
}: LabeledTextareaProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAiSuggest = async () => {
    if (!aiPrompt) return;
    setIsLoading(true);
    const suggestion = await generateWithGroq(`${aiPrompt}\n\nCurrent text: ${value || ""}`);
    onChange(suggestion);
    setIsLoading(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {aiPrompt && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAiSuggest}
            disabled={isLoading}
            className="h-7 px-2 text-xs"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            AI Suggest ✨
          </Button>
        )}
      </div>
      <Textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
