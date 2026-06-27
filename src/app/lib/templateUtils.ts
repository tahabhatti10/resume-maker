import type { FontChoice, DensityChoice, ResumeData } from "./types";

export function fontFamily(font: FontChoice): string {
  switch (font) {
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "mono":
      return "'SF Mono', ui-monospace, 'Courier New', monospace";
    default:
      return "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  }
}

export function densitySpace(density: DensityChoice): {
  section: number;
  block: number;
} {
  return density === "compact"
    ? { section: 20, block: 10 }
    : { section: 34, block: 16 };
}

export function hasAnyContent(data: ResumeData): boolean {
  return Boolean(
    data.contact.name ||
      data.summary ||
      data.experience.length ||
      data.education.length ||
      data.skills.length ||
      data.projects.length,
  );
}

export function initials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}
