import type { ResumeData } from "../types";
import { makeId } from "../sampleData";

// Mock "resume parsing": pretends to read an uploaded PDF/image and returns a
// ResumeData patch. In a real build this would call Claude with the file as a
// multimodal input and return structured JSON.
export function mockParseResume(fileName: string): Partial<ResumeData> {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
  const guessedName = titleCase(base) || "Alex Morgan";

  return {
    contact: {
      name: guessedName,
      title: "Software Engineer",
      email: `${base.replace(/\s+/g, ".").toLowerCase() || "alex.morgan"}@email.com`,
      phone: "+1 (555) 010-2233",
      location: "Austin, TX",
      website: "",
      avatarUrl: "",
    },
    summary:
      "Full-stack engineer with 5 years building reliable web platforms. Comfortable across the stack with a bias for clean, well-tested code and pragmatic delivery.",
    experience: [
      {
        id: makeId("exp"),
        company: "Acme Corp",
        role: "Software Engineer",
        location: "Austin, TX",
        start: "2022",
        end: "Present",
        current: true,
        bullets: [
          "Built and shipped core API services handling 5M requests/day.",
          "Reduced page load time by 45% through bundle and query optimization.",
        ],
      },
    ],
    skills: [
      {
        id: makeId("sk"),
        category: "Languages",
        items: ["TypeScript", "Python", "Go"],
      },
      {
        id: makeId("sk"),
        category: "Frameworks",
        items: ["React", "Node.js", "PostgreSQL"],
      },
    ],
  };
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
