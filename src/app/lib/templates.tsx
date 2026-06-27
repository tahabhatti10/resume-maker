import type { ComponentType } from "react";
import type { TemplateMeta } from "./types";
import type { TemplateProps } from "../components/templates/types";
import { TemplateMinimal } from "../components/templates/TemplateMinimal";
import { TemplateModern } from "../components/templates/TemplateModern";
import { TemplateSidebar } from "../components/templates/TemplateSidebar";
import { TemplateEditorial } from "../components/templates/TemplateEditorial";
import { TemplateCompact } from "../components/templates/TemplateCompact";

export interface RegisteredTemplate extends TemplateMeta {
  Component: ComponentType<TemplateProps>;
}

export const templates: RegisteredTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, single-column, lots of whitespace.",
    tier: "free",
    Component: TemplateMinimal,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Gradient header with an avatar and skill chips.",
    tier: "free",
    Component: TemplateModern,
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Colored sidebar for contact, skills & links.",
    tier: "free",
    Component: TemplateSidebar,
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Elegant serif, centered, magazine-style.",
    tier: "pro",
    Component: TemplateEditorial,
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense two-column layout for senior CVs.",
    tier: "pro",
    Component: TemplateCompact,
  },
];

export function getTemplate(id: string): RegisteredTemplate {
  return templates.find((t) => t.id === id) ?? templates[0];
}
