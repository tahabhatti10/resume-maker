import type { TemplateProps } from "./types";
import { fontFamily, densitySpace, initials } from "../../lib/templateUtils";
import { shade } from "./TemplateModern";

export function TemplateSidebar({ data, theme }: TemplateProps) {
  const { contact, summary, experience, education, skills, projects, links } =
    data;
  const sp = densitySpace(theme.density);
  const accent = theme.accent;

  return (
    <div
      style={{
        fontFamily: fontFamily(theme.font),
        color: "#23262e",
        background: "#ffffff",
        maxWidth: 880,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "270px 1fr",
        minHeight: 600,
        lineHeight: 1.55,
      }}
    >
      <aside
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, ${shade(accent, -25)} 100%)`,
          color: "#fff",
          padding: "40px 26px",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 700,
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
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center" }}>
          {contact.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: 13.5,
            textAlign: "center",
            opacity: 0.9,
            margin: "4px 0 22px",
          }}
        >
          {contact.title || "Your Title"}
        </p>

        <SideGroup title="Contact">
          {contact.email && <SideLine>{contact.email}</SideLine>}
          {contact.phone && <SideLine>{contact.phone}</SideLine>}
          {contact.location && <SideLine>{contact.location}</SideLine>}
          {contact.website && <SideLine>{contact.website}</SideLine>}
        </SideGroup>

        {skills.length > 0 && (
          <SideGroup title="Skills">
            {skills.map((g) => (
              <div key={g.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.95 }}>
                  {g.category}
                </div>
                <div style={{ fontSize: 12.5, opacity: 0.85 }}>
                  {g.items.join(", ")}
                </div>
              </div>
            ))}
          </SideGroup>
        )}

        {links.length > 0 && (
          <SideGroup title="Links">
            {links.map((l) => (
              <SideLine key={l.id}>
                {l.label}: {l.url}
              </SideLine>
            ))}
          </SideGroup>
        )}
      </aside>

      <main style={{ padding: "40px 40px" }}>
        {summary && (
          <MainSection title="Profile" accent={accent} sp={sp}>
            <p style={{ margin: 0, color: "#3a4152" }}>{summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience" accent={accent} sp={sp}>
            {experience.map((e) => (
              <div key={e.id} style={{ marginBottom: sp.block + 2 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ fontSize: 15 }}>{e.role}</strong>
                  <span style={{ fontSize: 12.5, color: "#8a92a3" }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: accent, fontWeight: 600 }}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#3a4152" }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ fontSize: 13, marginBottom: 3 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects" accent={accent} sp={sp}>
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: sp.block }}>
                <strong style={{ fontSize: 14.5 }}>{p.name}</strong>
                {p.link && (
                  <span style={{ fontSize: 12.5, color: accent }}> · {p.link}</span>
                )}
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#3a4152" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education" accent={accent} sp={sp}>
            {education.map((ed) => (
              <div key={ed.id} style={{ marginBottom: sp.block }}>
                <strong style={{ fontSize: 14.5 }}>{ed.school}</strong>
                <div style={{ fontSize: 13, color: "#5a6273" }}>
                  {[ed.degree, ed.field].filter(Boolean).join(", ")} · {ed.start}–
                  {ed.end}
                </div>
                {ed.details && (
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#6b7280" }}>
                    {ed.details}
                  </p>
                )}
              </div>
            ))}
          </MainSection>
        )}
      </main>
    </div>
  );
}

function SideGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3
        style={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          opacity: 0.8,
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          paddingBottom: 5,
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
function SideLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, marginBottom: 5, opacity: 0.92, wordBreak: "break-word" }}>
      {children}
    </div>
  );
}
function MainSection({
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
          fontSize: 13,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: accent,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
