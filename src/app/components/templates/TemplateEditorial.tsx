import type { TemplateProps } from "./types";
import { densitySpace } from "../../lib/templateUtils";

// Editorial template intentionally uses a serif display regardless of font choice.
export function TemplateEditorial({ data, theme }: TemplateProps) {
  const { contact, summary, experience, education, skills, projects, links } =
    data;
  const sp = densitySpace(theme.density);
  const accent = theme.accent;
  const serif = "Georgia, 'Times New Roman', serif";

  return (
    <div
      style={{
        fontFamily: serif,
        color: "#211f1c",
        background: "#fbfaf7",
        maxWidth: 800,
        margin: "0 auto",
        padding: "64px 60px",
        lineHeight: 1.6,
      }}
    >
      <header
        style={{
          textAlign: "center",
          borderBottom: `2px solid ${accent}`,
          paddingBottom: 24,
          marginBottom: sp.section + 6,
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          {contact.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: 15,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: accent,
            margin: "10px 0 14px",
          }}
        >
          {contact.title || "Your Title"}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "4px 18px",
            fontSize: 13,
            color: "#6b6760",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <span>{contact.website}</span>}
        </div>
      </header>

      {summary && (
        <p
          style={{
            fontSize: 17,
            fontStyle: "italic",
            textAlign: "center",
            color: "#3a362f",
            maxWidth: 600,
            margin: `0 auto ${sp.section + 6}px`,
          }}
        >
          {summary}
        </p>
      )}

      {experience.length > 0 && (
        <EdSection title="Experience" accent={accent} sp={sp}>
          {experience.map((e) => (
            <div key={e.id} style={{ marginBottom: sp.block + 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: 17 }}>{e.role}</strong>
                <span style={{ fontSize: 12.5, color: "#9a948a", fontFamily: "system-ui, sans-serif" }}>
                  {e.start} – {e.current ? "Present" : e.end}
                </span>
              </div>
              <div style={{ fontSize: 14.5, color: accent, fontStyle: "italic" }}>
                {e.company}
                {e.location ? `, ${e.location}` : ""}
              </div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20, color: "#3a362f" }}>
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={{ fontSize: 14, marginBottom: 4 }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </EdSection>
      )}

      {projects.length > 0 && (
        <EdSection title="Selected Work" accent={accent} sp={sp}>
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: sp.block }}>
              <strong style={{ fontSize: 16 }}>{p.name}</strong>
              {p.link && (
                <span style={{ fontSize: 13, color: accent, fontStyle: "italic" }}>
                  {" "}
                  — {p.link}
                </span>
              )}
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#3a362f" }}>
                {p.description}
              </p>
            </div>
          ))}
        </EdSection>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        {education.length > 0 && (
          <EdSection title="Education" accent={accent} sp={sp}>
            {education.map((ed) => (
              <div key={ed.id} style={{ marginBottom: sp.block }}>
                <strong style={{ fontSize: 15 }}>{ed.school}</strong>
                <div style={{ fontSize: 13.5, color: "#6b6760", fontStyle: "italic" }}>
                  {[ed.degree, ed.field].filter(Boolean).join(", ")}
                </div>
                <div style={{ fontSize: 12.5, color: "#9a948a", fontFamily: "system-ui, sans-serif" }}>
                  {ed.start} – {ed.end}
                </div>
              </div>
            ))}
          </EdSection>
        )}
        {skills.length > 0 && (
          <EdSection title="Expertise" accent={accent} sp={sp}>
            {skills.map((g) => (
              <div key={g.id} style={{ marginBottom: 8, fontSize: 13.5 }}>
                <strong>{g.category}</strong>
                <div style={{ color: "#5a554c" }}>{g.items.join(" · ")}</div>
              </div>
            ))}
          </EdSection>
        )}
      </div>

      {links.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: sp.section,
            paddingTop: 18,
            borderTop: "1px solid #e3ded4",
            fontSize: 13,
            color: "#6b6760",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "4px 18px",
          }}
        >
          {links.map((l) => (
            <span key={l.id}>
              {l.label}: {l.url}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EdSection({
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
          fontSize: 14,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: accent,
          textAlign: "center",
          margin: "0 0 16px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
