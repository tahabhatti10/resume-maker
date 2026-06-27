import type { TemplateProps } from "./types";
import { fontFamily, initials } from "../../lib/templateUtils";
import { tint } from "./TemplateModern";

// Dense, two-column single-page layout — great for senior CVs.
export function TemplateCompact({ data, theme }: TemplateProps) {
  const { contact, summary, experience, education, skills, projects, links } =
    data;
  const accent = theme.accent;

  return (
    <div
      style={{
        fontFamily: fontFamily(theme.font),
        color: "#262a31",
        background: "#ffffff",
        maxWidth: 840,
        margin: "0 auto",
        padding: "36px 40px",
        lineHeight: 1.45,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingBottom: 14,
          borderBottom: `2px solid ${accent}`,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 8,
            background: tint(accent),
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initials(contact.name)
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            {contact.name || "Your Name"}
          </h1>
          <span style={{ fontSize: 14, color: accent }}>
            {contact.title || "Your Title"}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: "#6b7280", textAlign: "right" }}>
          {contact.email && <div>{contact.email}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {contact.location && <div>{contact.location}</div>}
          {contact.website && <div>{contact.website}</div>}
        </div>
      </header>

      {summary && (
        <p style={{ fontSize: 12.5, color: "#3a4152", margin: "0 0 16px" }}>
          {summary}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 28 }}>
        <div>
          {experience.length > 0 && (
            <CSection title="Experience" accent={accent}>
              {experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: 13 }}>{e.role}</strong>
                    <span style={{ fontSize: 11, color: "#9aa1ad" }}>
                      {e.start}–{e.current ? "Now" : e.end}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
                    {e.company}
                  </div>
                  <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#3a4152" }}>
                    {e.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} style={{ fontSize: 11.5, marginBottom: 2 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CSection>
          )}

          {projects.length > 0 && (
            <CSection title="Projects" accent={accent}>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 9 }}>
                  <strong style={{ fontSize: 12.5 }}>{p.name}</strong>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#3a4152" }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </CSection>
          )}
        </div>

        <div>
          {skills.length > 0 && (
            <CSection title="Skills" accent={accent}>
              {skills.map((g) => (
                <div key={g.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{g.category}</div>
                  <div style={{ fontSize: 11.5, color: "#5a6273" }}>
                    {g.items.join(", ")}
                  </div>
                </div>
              ))}
            </CSection>
          )}

          {education.length > 0 && (
            <CSection title="Education" accent={accent}>
              {education.map((ed) => (
                <div key={ed.id} style={{ marginBottom: 9 }}>
                  <strong style={{ fontSize: 12.5 }}>{ed.school}</strong>
                  <div style={{ fontSize: 11.5, color: "#5a6273" }}>
                    {[ed.degree, ed.field].filter(Boolean).join(", ")}
                  </div>
                  <div style={{ fontSize: 11, color: "#9aa1ad" }}>
                    {ed.start}–{ed.end}
                  </div>
                </div>
              ))}
            </CSection>
          )}

          {links.length > 0 && (
            <CSection title="Links" accent={accent}>
              {links.map((l) => (
                <div key={l.id} style={{ fontSize: 11.5, marginBottom: 3 }}>
                  <strong>{l.label}:</strong>{" "}
                  <span style={{ color: accent }}>{l.url}</span>
                </div>
              ))}
            </CSection>
          )}
        </div>
      </div>
    </div>
  );
}

function CSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2
        style={{
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: accent,
          margin: "0 0 8px",
          paddingBottom: 3,
          borderBottom: "1px solid #ececec",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
