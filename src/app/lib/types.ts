// Central data model for the resume website maker.

export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  avatarUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  details: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  links: LinkItem[];
}

export type FontChoice = "sans" | "serif" | "mono";
export type DensityChoice = "comfortable" | "compact";

export interface ThemeConfig {
  templateId: string;
  accent: string; // hex
  font: FontChoice;
  density: DensityChoice;
}

export type Tier = "free" | "pro";

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  tier: Tier;
  // The renderer is registered separately to keep this serializable-friendly.
}
