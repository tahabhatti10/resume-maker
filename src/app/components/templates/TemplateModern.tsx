import type { TemplateProps } from "./types";
import { fontFamily, densitySpace, initials } from "../../lib/templateUtils";

export function TemplateModern({ data, theme }: TemplateProps) {
  const { contact, summary, experience, education, skills, projects, links } =
    data;
  const sp = densitySpace(theme.density);
  const accent = theme.accent;

  return (
    <div
      style={{
        fontFamily: fontFamily(theme.font),
        color: "#1f2430",
        background: "#ffffff",
        maxWidth: 860,
        margin: "0 auto",
        lineHeight: 1.55,
      }}
    >
      <header
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${shade(accent, -22)} 100%)`,
          color: "#fff",
          padding: "44px 48px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
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
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            {contact.name || "Your Name"}
          </h1>
          <p style={{ fontSize: 17, margin: "4px 0 12px", opacity: 0.92 }}>
            {contact.title || "Your Title"}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              fontSize: 13,
              opacity: 0.95,
            }}
          >
            {contact.email && <span>✉ {contact.email}</span>}
            {contact.phone && <span>☎ {contact.phone}</span>}
            {contact.location && <span>⌖ {contact.location}</span>}
            {contact.website && <span>◎ {contact.website}</span>}
          </div>
        </div>
      </header>

      <div style={{ padding: "40px 48px" }}>
        {summary && (
          <Block title="Profile" accent={accent} sp={sp}>
            <p style={{ margin: 0, color: "#3a4152" }}>{summary}</p>
          </Block>
        )}

        {experience.length > 0 && (
          <Block title="Experience" accent={accent} sp={sp}>
            {experience.map((e) => (
              <div
                key={e.id}
                style={{
                  borderLeft: `2px solid ${accent}`,
                  paddingLeft: 16,
                  marginBottom: sp.block + 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ fontSize: 15.5 }}>{e.role}</strong>
                  <span style={{ fontSize: 12.5, color: "#8a92a3" }}>
                    {e.start} – {e.current ? "Present" : e.end}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: accent, fontWeight: 600 }}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#3a4152" }}>
                  {e.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ fontSize: 13.5, marginBottom: 3 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Block>
        )}

        {projects.length > 0 && (
          <Block title="Projects" accent={accent} sp={sp}>
            <div style={{ display: "grid", gap: 12 }}>
              {projects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#f6f8fc",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <strong style={{ fontSize: 14.5 }}>{p.name}</strong>
                  <p style={{ margin: "4px 0 6px", fontSize: 13, color: "#3a4152" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.filter(Boolean).map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          background: tint(accent),
                          color: accent,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Block>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {education.length > 0 && (
            <Block title="Education" accent={accent} sp={sp}>
              {education.map((ed) => (
                <div key={ed.id} style={{ marginBottom: sp.block }}>
                  <strong style={{ fontSize: 14.5 }}>{ed.school}</strong>
                  <div style={{ fontSize: 13, color: "#5a6273" }}>
                    {[ed.degree, ed.field].filter(Boolean).join(", ")}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#8a92a3" }}>
                    {ed.start} – {ed.end}
                  </div>
                </div>
              ))}
            </Block>
          )}

          {skills.length > 0 && (
            <Block title="Skills" accent={accent} sp={sp}>
              {skills.map((g) => (
                <div key={g.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{g.category}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                    {g.items.map((it, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11.5,
                          background: tint(accent),
                          color: accent,
                          padding: "2px 9px",
                          borderRadius: 6,
                        }}
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Block>
          )}
        </div>

        {links.length > 0 && (
          <Block title="Links" accent={accent} sp={sp}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
              {links.map((l) => (
                <span key={l.id} style={{ fontSize: 13 }}>
                  <strong>{l.label}:</strong>{" "}
                  <span style={{ color: accent }}>{l.url}</span>
                </span>
              ))}
            </div>
          </Block>
        )}
      </div>
    </div>
  );
}

function Block({
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
          fontSize: 16,
          fontWeight: 700,
          margin: "0 0 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 18,
            height: 3,
            background: accent,
            borderRadius: 2,
            display: "inline-block",
          }}
        />
        {title}
      </h2>
      {children}
    </section>
  );
}

// Color helpers (shared shape with htmlExport).
export function shade(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (c * percent) / 100)));
  return rgbToHex(f(r), f(g), f(b));
}
export function tint(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}
