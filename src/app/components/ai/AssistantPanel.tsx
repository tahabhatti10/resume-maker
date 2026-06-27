import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAI } from "../../state/AIContext";
import type { ChatMessage } from "../../state/AIContext";
import { useBuilder } from "../../state/BuilderContext";
import type { ResumeData } from "../../lib/types";
import { FileDropzone } from "./FileDropzone";

const QUICK = ["Write my summary", "Improve my bullets", "Suggest skills"];

export function AssistantPanel() {
  const { messages, pending, sendMessage } = useAI();
  const { applyPatch } = useBuilder();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending]);

  const submit = async () => {
    if (!text.trim() && files.length === 0) return;
    const toSend = text;
    const toFiles = files;
    setText("");
    setFiles([]);
    await sendMessage(toSend, toFiles);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <div className="font-medium">AI Assistant</div>
          <div className="text-xs text-muted-foreground">
            Drafts, edits & imports your resume
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onApply={applyPatch} />
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => setText(q)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              {q}
            </button>
          ))}
        </div>
        <FileDropzone files={files} onChange={setFiles} />
        <div className="mt-2 flex gap-2">
          <Input
            value={text}
            placeholder="Ask the assistant…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <Button onClick={submit} disabled={pending} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onApply,
}: {
  message: ChatMessage;
  onApply: (patch: Partial<ResumeData>) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>
      <div className={`max-w-[80%] space-y-2 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {message.text}
        </div>
        {message.fileNames?.map((f) => (
          <div key={f} className="text-xs text-muted-foreground">
            📎 {f}
          </div>
        ))}
        {message.suggestion && (
          <div className="rounded-xl border border-border bg-card p-3 text-left">
            <div className="mb-1 flex items-center gap-1.5 text-sm font-medium">
              <Wand2 className="h-4 w-4 text-primary" /> Suggested import
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              I extracted details from your file. Apply them to your resume?
            </p>
            <Button
              size="sm"
              onClick={() => {
                onApply(message.suggestion ?? {});
                toast.success("Applied to your resume");
              }}
            >
              Apply suggestion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
