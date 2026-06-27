const DEFAULT_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";

export async function getGroqAssistantReply(
  prompt: string,
  hasFiles: boolean,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GROQ_API_KEY");
  }

  const systemPrompt = [
    "You are a helpful resume writing assistant.",
    "Help the user improve their resume summary, bullets, and structure.",
    "Keep responses concise, practical, and tailored to resume writing.",
    hasFiles ? "The user uploaded a file, so you can reference that context." : "",
  ]
    .filter(Boolean)
    .join(" ");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "I couldn't generate a reply right now.";
}
