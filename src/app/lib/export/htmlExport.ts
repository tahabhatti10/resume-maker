import type { ResumeData, ThemeConfig } from "../types";
import { fontFamily } from "../templateUtils";

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 37,
    g: parseInt(full.slice(2, 4), 16) || 99,
    b: parseInt(full.slice(4, 6), 16) || 235,
  };
}
function shade(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (c * percent) / 100)));
  return (
    "#" +
    [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")
  );
}

function section(title: string, inner: string): string {
  if (!inner.trim()) return "";
  return `<section class="sec"><h2>${esc(title)}</h2>${inner}</section>`;
}

function experienceHtml(data: ResumeData): string {
  if (!data.experience.length) return "";
  const items = data.experience
    .map(
      (e) => `
      <div class="item">
        <div class="row">
          <strong>${esc(e.role)}</strong>
          <span class="muted">${esc(e.start)} – ${e.current ? "Present" : esc(e.end)}</span>
        </div>
        <div class="accent-text">${esc(e.company)}${e.location ? " · " + esc(e.location) : ""}</div>
        <ul>${e.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("");
  return section("Experience", items);
}

function projectsHtml(data: ResumeData): string {
  if (!data.projects.length) return "";
  const items = data.projects
    .map(
      (p) => `
      <div class="item">
        <strong>${esc(p.name)}</strong>${p.link ? ` <span class="accent-text">· ${esc(p.link)}</span>` : ""}
        <p>${esc(p.description)}</p>
        ${p.tags.filter(Boolean).length ? `<div class="chips">${p.tags.filter(Boolean).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>`,
    )
    .join("");
  return section("Projects", items);
}

function educationHtml(data: ResumeData): string {
  if (!data.education.length) return "";
  const items = data.education
    .map(
      (ed) => `
      <div class="item">
        <div class="row"><strong>${esc(ed.school)}</strong><span class="muted">${esc(ed.start)} – ${esc(ed.end)}</span></div>
        <div class="muted">${esc([ed.degree, ed.field].filter(Boolean).join(", "))}</div>
        ${ed.details ? `<p>${esc(ed.details)}</p>` : ""}
      </div>`,
    )
    .join("");
  return section("Education", items);
}

function skillsHtml(data: ResumeData): string {
  if (!data.skills.length) return "";
  const items = data.skills
    .map(
      (g) =>
        `<div class="item"><strong>${esc(g.category)}:</strong> ${esc(g.items.join(", "))}</div>`,
    )
    .join("");
  return section("Skills", items);
}

function linksHtml(data: ResumeData): string {
  if (!data.links.length) return "";
  const items = `<div class="links">${data.links
    .map(
      (l) =>
        `<span><strong>${esc(l.label)}:</strong> <span class="accent-text">${esc(l.url)}</span></span>`,
    )
    .join("")}</div>`;
  return section("Links", items);
}

export function buildResumeHtml(data: ResumeData, theme: ThemeConfig): string {
  const accent = theme.accent;
  const { r, g, b } = hexToRgb(accent);
  const accentSoft = `rgba(${r}, ${g}, ${b}, 0.12)`;
  const c = data.contact;

  const contactLine = [c.email, c.phone, c.location, c.website]
    .filter(Boolean)
    .map((x) => `<span>${esc(x)}</span>`)
    .join("");

  const body = `
    ${data.summary ? section("About", `<p>${esc(data.summary)}</p>`) : ""}
    ${experienceHtml(data)}
    ${projectsHtml(data)}
    ${educationHtml(data)}
    ${skillsHtml(data)}
    ${linksHtml(data)}
  `;

  const isGradient = theme.templateId === "modern" || theme.templateId === "sidebar";
  const headerStyle = isGradient
    ? `background:linear-gradient(135deg, ${accent} 0%, ${shade(accent, -22)} 100%); color:#fff; padding:48px 0;`
    : `padding:48px 0 24px; border-bottom:1px solid #e6e6e6;`;
  const headerNameColor = isGradient ? "#fff" : "#1a1a1a";
  const headerTitleColor = isGradient ? "rgba(255,255,255,0.92)" : accent;
  const headerMutedColor = isGradient ? "rgba(255,255,255,0.9)" : "#666";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(c.name || "Resume")}${c.title ? " — " + esc(c.title) : ""}</title>
<meta name="description" content="${esc(c.title || "Personal resume")} — ${esc(c.name || "")}" />
<style>
  :root { --accent:${accent}; --accent-soft:${accentSoft}; }
  * { box-sizing: border-box; }
  body { margin:0; font-family:${fontFamily(theme.font)}; color:#222; background:#f4f5f7; line-height:1.55; }
  .page { max-width:840px; margin:32px auto; background:#fff; box-shadow:0 6px 30px rgba(0,0,0,0.08); border-radius:12px; overflow:hidden; }
  header { ${headerStyle} }
  .header-inner { max-width:720px; margin:0 auto; padding:0 40px; }
  header h1 { margin:0; font-size:34px; color:${headerNameColor}; }
  header .title { font-size:18px; margin:6px 0 12px; color:${headerTitleColor}; }
  .contact { display:flex; flex-wrap:wrap; gap:6px 18px; font-size:13px; color:${headerMutedColor}; }
  .content { padding:36px 40px; max-width:720px; margin:0 auto; }
  .sec { margin-bottom:30px; }
  .sec h2 { font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:var(--accent); border-bottom:1px solid #eaeaea; padding-bottom:5px; margin:0 0 14px; }
  .item { margin-bottom:14px; }
  .row { display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
  .muted { color:#888; font-size:13px; }
  .accent-text { color:var(--accent); font-size:14px; }
  ul { margin:6px 0 0; padding-left:18px; }
  li { font-size:13.5px; margin-bottom:3px; }
  p { margin:4px 0 0; font-size:13.5px; color:#333; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
  .chip { font-size:11px; background:var(--accent-soft); color:var(--accent); padding:2px 9px; border-radius:999px; }
  .links { display:flex; flex-wrap:wrap; gap:6px 18px; font-size:13.5px; }
  footer { text-align:center; font-size:11px; color:#aaa; padding:18px; }
  @media (max-width:600px) {
    .page { margin:0; border-radius:0; }
    .header-inner, .content { padding-left:22px; padding-right:22px; }
    header h1 { font-size:27px; }
  }
</style>
</head>
<body>
  <div class="page">
    <header>
      <div class="header-inner">
        <h1>${esc(c.name || "Your Name")}</h1>
        <div class="title">${esc(c.title || "Your Title")}</div>
        <div class="contact">${contactLine}</div>
      </div>
    </header>
    <div class="content">
      ${body}
    </div>
    <footer>Built with Resumio</footer>
  </div>
</body>
</html>`;
}

export function suggestedFilename(data: ResumeData): string {
  const slug = (data.contact.name || "resume")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "resume"}-site.html`;
}
