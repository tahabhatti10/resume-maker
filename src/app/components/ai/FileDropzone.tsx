import { useRef, useState } from "react";
import { Paperclip, X, FileText } from "lucide-react";

interface FileDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function FileDropzone({ files, onChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const add = (list: FileList | null) => {
    if (!list) return;
    onChange([...files, ...Array.from(list)]);
  };

  return (
    <div>
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span
              key={`${f.name}-${i}`}
              className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="max-w-[140px] truncate">{f.name}</span>
              <button
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={`flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-xs transition ${
          dragging
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:border-primary/50"
        }`}
      >
        <Paperclip className="h-3.5 w-3.5" />
        Drop a resume (PDF/image) or click to attach
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,image/*,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
