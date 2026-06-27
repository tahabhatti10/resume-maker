import type { TemplateProps } from "./types";
import { fontFamily, densitySpace } from "../../lib/templateUtils";

export function TemplateMinimal({ data, theme }: TemplateProps) {
  const { contact, summary, experience, education, skills, projects, links } =
    data;
  const sp = densitySpace(theme.density);
  const accent = theme.accent;

  return (
    <div
      style={{
        fontFamily: fontFamily(theme.font),
        color: "#1a1a1a",
        background: "#ffffff",
        padding: "56px 56px",
        maxWidth: 820,
        margin: "0 auto",
        lineHeight: 1.55,
      }}
    >
      <header style={{ marginBottom: sp.section }}>
        <h1 style={{ fontSize: 34, fontWeight: 700, margin: 0 }}>
          {contact.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 17, color: accent, margin: "4px 0 10px" }}>
          {contact.title || "Your Title"}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 16px",
            fontSize: 13,
            color: "#555",
          }}
        >
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <span style={{ color: accent }}>{contact.website}</span>}
        </div>
      </header>

      {summary && (
        <Section title="About" accent={accent} sp={sp}>
          <p style={{ margin: 0, color: "#333" }}>{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent={accent} sp={sp}>
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: sp.block }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <strong style={{ fontSize: 15 }}>{e.role}</strong>
                <span style={{ fontSize: 13, color: "#777" }}>
                  {e.start} – {e.current ? "Present" : e.end}
                </span>
              </div>
              <div style={{ fontSize: 14, color: accent }}>
                {e.company}
                {e.location ? ` · ${e.location}` : ""}
              </div>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#333" }}>
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ fontSize: 13.5, marginBottom: 3 }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent={accent} sp={sp}>
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: sp.block }}>
              <strong style={{ fontSize: 15 }}>{p.name}</strong>
              {p.link && (
                <span style={{ fontSize: 13, color: accent }}> · {p.link}</span>
              )}
              <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#333" }}>
                {p.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent={accent} sp={sp}>
          {education.map((ed) => (
            <div key={ed.id} style={{ marginBottom: sp.block }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <strong style={{ fontSize: 15 }}>{ed.school}</strong>
                <span style={{ fontSize: 13, color: "#777" }}>
                  {ed.start} – {ed.end}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: "#555" }}>
                {[ed.degree, ed.field].filter(Boolean).join(", ")}
              </div>
              {ed.details && (
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
                  {ed.details}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent={accent} sp={sp}>
          {skills.map((g) => (
            <div key={g.id} style={{ marginBottom: 8, fontSize: 13.5 }}>
              <strong>{g.category}: </strong>
              <span style={{ color: "#444" }}>{g.items.join(", ")}</span>
            </div>
          ))}
        </Section>
      )}

      {links.length > 0 && (
        <Section title="Links" accent={accent} sp={sp}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
            {links.map((l) => (
              <span key={l.id} style={{ fontSize: 13.5 }}>
                <strong>{l.label}:</strong>{" "}
                <span style={{ color: accent }}>{l.url}</span>
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  accent,
  sp,
  children,
}: {
  title: string;
  accent: string;
  sp: { section: number; block: number };
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: sp.section }}>
      <h2
        style={{
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: accent,
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: 4,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
