import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ResumeData } from "../lib/types";
import { getGroqAssistantReply } from "../lib/ai/groqAssistant";
import { mockParseResume } from "../lib/ai/mockParseResume";
import { makeId } from "../lib/sampleData";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  fileNames?: string[];
  suggestion?: Partial<ResumeData>;
}

interface AIContextValue {
  messages: ChatMessage[];
  pending: boolean;
  sendMessage: (text: string, files: File[]) => Promise<void>;
  clear: () => void;
}

const AIContext = createContext<AIContextValue | null>(null);

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: "Hi! I'm your resume assistant. Ask me to write a summary, sharpen a bullet, or upload an existing resume (PDF or image) and I'll import the details for you.",
};

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [pending, setPending] = useState(false);

  const sendMessage = useCallback(async (text: string, files: File[]) => {
    const fileNames = files.map((f) => f.name);
    const userMsg: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: text || (fileNames.length ? "(uploaded a file)" : ""),
      fileNames: fileNames.length ? fileNames : undefined,
    };
    setMessages((m) => [...m, userMsg]);
    setPending(true);

    let replyText = "I couldn't generate a reply right now.";

    try {
      replyText = await getGroqAssistantReply(text, files.length > 0);
    } catch (error) {
      console.error("Groq assistant error", error);
      replyText =
        "The AI assistant is not configured yet. Set VITE_GROQ_API_KEY in your environment to enable live replies.";
    }

    const suggestion =
      files.length > 0 ? mockParseResume(files[0].name) : undefined;

    const assistantMsg: ChatMessage = {
      id: makeId("msg"),
      role: "assistant",
      text: replyText,
      suggestion,
    };
    setMessages((m) => [...m, assistantMsg]);
    setPending(false);
  }, []);

  const clear = useCallback(() => setMessages([GREETING]), []);

  const value = useMemo<AIContextValue>(
    () => ({ messages, pending, sendMessage, clear }),
    [messages, pending, sendMessage, clear],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
