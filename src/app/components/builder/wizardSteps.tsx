import type { ComponentType } from "react";
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Link as LinkIcon,
  Palette,
  Download,
} from "lucide-react";
import { ContactStep } from "./steps/ContactStep";
import { SummaryStep } from "./steps/SummaryStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { EducationStep } from "./steps/EducationStep";
import { SkillsStep } from "./steps/SkillsStep";
import { ProjectsStep } from "./steps/ProjectsStep";
import { LinksStep } from "./steps/LinksStep";
import { DesignStep } from "./DesignStep";
import { ExportPanel } from "./ExportPanel";

export interface WizardStep {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  Component: ComponentType;
}

export const wizardSteps: WizardStep[] = [
  { id: "contact", label: "Contact", icon: User, Component: ContactStep },
  { id: "summary", label: "Summary", icon: AlignLeft, Component: SummaryStep },
  { id: "experience", label: "Experience", icon: Briefcase, Component: ExperienceStep },
  { id: "education", label: "Education", icon: GraduationCap, Component: EducationStep },
  { id: "skills", label: "Skills", icon: Wrench, Component: SkillsStep },
  { id: "projects", label: "Projects", icon: FolderGit2, Component: ProjectsStep },
  { id: "links", label: "Links", icon: LinkIcon, Component: LinksStep },
  { id: "design", label: "Design", icon: Palette, Component: DesignStep },
  { id: "export", label: "Export", icon: Download, Component: ExportPanel },
];
