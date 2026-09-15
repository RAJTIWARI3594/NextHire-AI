import { create } from "zustand";
import type { ResumeData, TemplateVariant } from "@/types/resume";
import { defaultResumeData } from "@/services/resume-service";

interface ResumeStore {
  resume: ResumeData;
  activeTemplate: TemplateVariant;
  saveStatus: "idle" | "saving" | "saved";
  activeTab:
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages";

  setResume: (resume: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;
  setTemplate: (template: TemplateVariant) => void;
  setActiveTab: (tab: ResumeStore["activeTab"]) => void;

  // Collection Handlers
  addEducation: (edu: ResumeData["education"][0]) => void;
  removeEducation: (id: string) => void;

  addExperience: (exp: ResumeData["experience"][0]) => void;
  removeExperience: (id: string) => void;

  addSkill: (skill: ResumeData["skills"][0]) => void;
  removeSkill: (id: string) => void;

  addProject: (proj: ResumeData["projects"][0]) => void;
  removeProject: (id: string) => void;

  triggerAutoSave: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: defaultResumeData,
  activeTemplate: "modern",
  saveStatus: "saved",
  activeTab: "personal",

  setResume: (resume) =>
    set({ resume, activeTemplate: resume.template || "modern" }),
  updatePersonalInfo: (info) => {
    set((state) => ({
      resume: {
        ...state.resume,
        personalInfo: { ...state.resume.personalInfo, ...info },
      },
    }));
    get().triggerAutoSave();
  },

  updateSummary: (summary) => {
    set((state) => ({
      resume: { ...state.resume, summary },
    }));
    get().triggerAutoSave();
  },

  setTemplate: (activeTemplate) => {
    set((state) => ({
      activeTemplate,
      resume: { ...state.resume, template: activeTemplate },
    }));
    get().triggerAutoSave();
  },

  setActiveTab: (activeTab) => set({ activeTab }),

  addEducation: (edu) => {
    set((state) => ({
      resume: { ...state.resume, education: [...state.resume.education, edu] },
    }));
    get().triggerAutoSave();
  },
  removeEducation: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((e) => e.id !== id),
      },
    }));
    get().triggerAutoSave();
  },

  addExperience: (exp) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: [...state.resume.experience, exp],
      },
    }));
    get().triggerAutoSave();
  },
  removeExperience: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.filter((e) => e.id !== id),
      },
    }));
    get().triggerAutoSave();
  },

  addSkill: (skill) => {
    set((state) => ({
      resume: { ...state.resume, skills: [...state.resume.skills, skill] },
    }));
    get().triggerAutoSave();
  },
  removeSkill: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((s) => s.id !== id),
      },
    }));
    get().triggerAutoSave();
  },

  addProject: (proj) => {
    set((state) => ({
      resume: { ...state.resume, projects: [...state.resume.projects, proj] },
    }));
    get().triggerAutoSave();
  },
  removeProject: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((p) => p.id !== id),
      },
    }));
    get().triggerAutoSave();
  },

  triggerAutoSave: () => {
    set({ saveStatus: "saving" });
    setTimeout(() => {
      set({ saveStatus: "saved" });
    }, 800);
  },
}));
