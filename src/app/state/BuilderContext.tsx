import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  ResumeData,
  ThemeConfig,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  ProjectItem,
  LinkItem,
} from "../lib/types";
import { emptyResume, sampleResume, defaultTheme, makeId } from "../lib/sampleData";

const STORAGE_KEY = "resume-maker:v1";

interface PersistShape {
  resume: ResumeData;
  theme: ThemeConfig;
}

interface BuilderContextValue {
  resume: ResumeData;
  theme: ThemeConfig;
  setContact: (patch: Partial<ResumeData["contact"]>) => void;
  setSummary: (v: string) => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
  // generic list helpers
  addExperience: () => void;
  addEducation: () => void;
  addSkill: () => void;
  addProject: () => void;
  addLink: () => void;
  updateItem: <K extends ListKey>(
    key: K,
    id: string,
    patch: Partial<ResumeData[K][number]>,
  ) => void;
  removeItem: (key: ListKey, id: string) => void;
  loadSample: () => void;
  reset: () => void;
  applyPatch: (patch: Partial<ResumeData>) => void;
}

type ListKey = "experience" | "education" | "skills" | "projects" | "links";

const BuilderContext = createContext<BuilderContextValue | null>(null);

function loadInitial(): PersistShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistShape;
      return {
        resume: { ...emptyResume, ...parsed.resume },
        theme: { ...defaultTheme, ...parsed.theme },
      };
    }
  } catch {
    // ignore corrupt storage
  }
  return { resume: sampleResume, theme: defaultTheme };
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(loadInitial, []);
  const [resume, setResume] = useState<ResumeData>(initial.resume);
  const [theme, setThemeState] = useState<ThemeConfig>(initial.theme);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ resume, theme }));
      } catch {
        // storage may be unavailable
      }
    }, 300);
    return () => clearTimeout(t);
  }, [resume, theme]);

  const setContact = useCallback(
    (patch: Partial<ResumeData["contact"]>) =>
      setResume((r) => ({ ...r, contact: { ...r.contact, ...patch } })),
    [],
  );
  const setSummary = useCallback(
    (v: string) => setResume((r) => ({ ...r, summary: v })),
    [],
  );
  const setTheme = useCallback(
    (patch: Partial<ThemeConfig>) => setThemeState((t) => ({ ...t, ...patch })),
    [],
  );

  const addExperience = useCallback(() => {
    const item: ExperienceItem = {
      id: makeId("exp"),
      company: "",
      role: "",
      location: "",
      start: "",
      end: "",
      current: false,
      bullets: [""],
    };
    setResume((r) => ({ ...r, experience: [...r.experience, item] }));
  }, []);
  const addEducation = useCallback(() => {
    const item: EducationItem = {
      id: makeId("edu"),
      school: "",
      degree: "",
      field: "",
      start: "",
      end: "",
      details: "",
    };
    setResume((r) => ({ ...r, education: [...r.education, item] }));
  }, []);
  const addSkill = useCallback(() => {
    const item: SkillGroup = { id: makeId("sk"), category: "", items: [] };
    setResume((r) => ({ ...r, skills: [...r.skills, item] }));
  }, []);
  const addProject = useCallback(() => {
    const item: ProjectItem = {
      id: makeId("pr"),
      name: "",
      description: "",
      link: "",
      tags: [],
    };
    setResume((r) => ({ ...r, projects: [...r.projects, item] }));
  }, []);
  const addLink = useCallback(() => {
    const item: LinkItem = { id: makeId("ln"), label: "", url: "" };
    setResume((r) => ({ ...r, links: [...r.links, item] }));
  }, []);

  const updateItem = useCallback(
    <K extends ListKey>(
      key: K,
      id: string,
      patch: Partial<ResumeData[K][number]>,
    ) => {
      setResume((r) => ({
        ...r,
        [key]: (r[key] as Array<{ id: string }>).map((it) =>
          it.id === id ? { ...it, ...patch } : it,
        ),
      }));
    },
    [],
  );

  const removeItem = useCallback((key: ListKey, id: string) => {
    setResume((r) => ({
      ...r,
      [key]: (r[key] as Array<{ id: string }>).filter((it) => it.id !== id),
    }));
  }, []);

  const loadSample = useCallback(() => {
    setResume(sampleResume);
  }, []);
  const reset = useCallback(() => {
    setResume(emptyResume);
  }, []);

  const applyPatch = useCallback((patch: Partial<ResumeData>) => {
    setResume((r) => ({ ...r, ...patch }));
  }, []);

  const value = useMemo<BuilderContextValue>(
    () => ({
      resume,
      theme,
      setContact,
      setSummary,
      setTheme,
      addExperience,
      addEducation,
      addSkill,
      addProject,
      addLink,
      updateItem,
      removeItem,
      loadSample,
      reset,
      applyPatch,
    }),
    [
      resume,
      theme,
      setContact,
      setSummary,
      setTheme,
      addExperience,
      addEducation,
      addSkill,
      addProject,
      addLink,
      updateItem,
      removeItem,
      loadSample,
      reset,
      applyPatch,
    ],
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder(): BuilderContextValue {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
