// Mock assistant reply generator. Swap for a Claude API call later — keep the
// (prompt, hasFiles) => Promise<string> shape.

const CANNED: { match: RegExp; reply: string }[] = [
  {
    match: /summary|about|profile/i,
    reply:
      "Here's a punchy summary you can drop in:\n\n\"Results-driven professional with a track record of shipping high-impact work. I combine strong technical skills with clear communication to move projects from idea to launch.\"\n\nWant me to tailor it to a specific role?",
  },
  {
    match: /bullet|experience|achievement/i,
    reply:
      "Strong bullets start with an action verb and end with a measurable result. Try:\n• Led X that improved Y by Z%\n• Built X used by N people\n• Reduced X from A to B\n\nPaste a bullet and I'll rewrite it.",
  },
  {
    match: /skill/i,
    reply:
      "Group skills by category (e.g. Languages, Tools, Soft Skills) and list the 4–6 most relevant per group. Recruiters skim — lead with what the job asks for.",
  },
  {
    match: /template|design|color|theme/i,
    reply:
      "For most roles, Minimal or Modern reads best. Use a single accent color, keep to one or two fonts, and let whitespace do the work. Pro unlocks the Editorial and Compact layouts.",
  },
];

export async function mockAssistantReply(
  prompt: string,
  hasFiles: boolean,
): Promise<string> {
  await delay(650 + Math.random() * 600);

  if (hasFiles) {
    return "I read your file and pulled out your contact details, a summary, your latest role, and your skills. Check the suggestion below — hit \"Apply\" to drop it into your resume, then tweak anything you like.";
  }

  const hit = CANNED.find((c) => c.match.test(prompt));
  if (hit) return hit.reply;

  return "Good question! I can help you write summaries, sharpen experience bullets, pick a template, or import details from an existing resume file. What would you like to work on?";
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
