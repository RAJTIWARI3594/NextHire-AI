import { create } from "zustand";
import type { JobFilterState } from "@/types/jobs";

interface JobsStore {
  filters: JobFilterState;
  savedJobIds: string[];
  appliedJobIds: string[];

  setSearchQuery: (query: string) => void;
  setWorkMode: (mode: string) => void;
  setJobType: (type: string) => void;
  resetFilters: () => void;
  toggleSaveJob: (jobId: string) => void;
  addAppliedJob: (jobId: string) => void;
}

const initialFilters: JobFilterState = {
  searchQuery: "",
  workMode: "All",
  jobType: "All",
  minSalary: 0,
  experienceYears: "All",
};

export const useJobsStore = create<JobsStore>((set) => ({
  filters: initialFilters,
  savedJobIds: [],
  appliedJobIds: [],

  setSearchQuery: (searchQuery) =>
    set((state) => ({ filters: { ...state.filters, searchQuery } })),

  setWorkMode: (workMode) =>
    set((state) => ({ filters: { ...state.filters, workMode } })),

  setJobType: (jobType) =>
    set((state) => ({ filters: { ...state.filters, jobType } })),

  resetFilters: () => set({ filters: initialFilters }),

  toggleSaveJob: (jobId) =>
    set((state) => ({
      savedJobIds: state.savedJobIds.includes(jobId)
        ? state.savedJobIds.filter((id) => id !== jobId)
        : [...state.savedJobIds, jobId],
    })),

  addAppliedJob: (jobId) =>
    set((state) => ({
      appliedJobIds: state.appliedJobIds.includes(jobId)
        ? state.appliedJobIds
        : [...state.appliedJobIds, jobId],
    })),
}));
