import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateWithGroq(prompt: string): Promise<string> {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    return "AI is not configured yet. Add VITE_GROQ_API_KEY to your environment.";
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful resume-writing assistant. Return concise, polished content suitable for resumes and professional profiles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }

    return "The AI did not return any usable content.";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return `AI request failed: ${message}`;
  }
}
