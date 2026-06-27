import type { ResumeData, ThemeConfig } from "./types";

let idCounter = 0;
export function makeId(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export const defaultTheme: ThemeConfig = {
  templateId: "minimal",
  accent: "#2563eb",
  font: "sans",
  density: "comfortable",
};

export const emptyResume: ResumeData = {
  contact: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatarUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  links: [],
};

export const sampleResume: ResumeData = {
  contact: {
    name: "Jordan Rivera",
    title: "Senior Product Designer",
    email: "jordan.rivera@email.com",
    phone: "+1 (555) 214-8890",
    location: "San Francisco, CA",
    website: "jordanrivera.design",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  summary:
    "Product designer with 8+ years crafting intuitive, accessible interfaces for fintech and SaaS. I lead design systems, partner closely with engineering, and turn ambiguous problems into shipped products that move metrics.",
  experience: [
    {
      id: "exp-1",
      company: "Northwind Financial",
      role: "Senior Product Designer",
      location: "San Francisco, CA",
      start: "2021",
      end: "Present",
      current: true,
      bullets: [
        "Led the redesign of the mobile investing flow, lifting activation by 34%.",
        "Built and maintained a 120-component design system adopted by 4 product teams.",
        "Mentored 3 junior designers and ran weekly design critiques.",
      ],
    },
    {
      id: "exp-2",
      company: "Brightline Apps",
      role: "Product Designer",
      location: "Remote",
      start: "2018",
      end: "2021",
      current: false,
      bullets: [
        "Shipped 12 major features across iOS and web for a 2M-user productivity app.",
        "Introduced usability testing cadence that cut post-launch defects by 40%.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      start: "2010",
      end: "2014",
      details: "Graduated with honors. Focus on interaction & systems design.",
    },
  ],
  skills: [
    {
      id: "sk-1",
      category: "Design",
      items: ["Figma", "Prototyping", "Design Systems", "User Research"],
    },
    {
      id: "sk-2",
      category: "Technical",
      items: ["HTML/CSS", "React", "Accessibility", "Motion"],
    },
  ],
  projects: [
    {
      id: "pr-1",
      name: "Coral Design Kit",
      description:
        "An open-source component library with 200+ tokens, downloaded 14k times.",
      link: "github.com/jordan/coral",
      tags: ["Open Source", "Design System"],
    },
  ],
  links: [
    { id: "ln-1", label: "LinkedIn", url: "linkedin.com/in/jordanrivera" },
    { id: "ln-2", label: "Dribbble", url: "dribbble.com/jordanrivera" },
  ],
};
