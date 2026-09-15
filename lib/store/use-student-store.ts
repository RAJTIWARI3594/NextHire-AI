import { create } from "zustand";
import type { StudentMetrics } from "@/services/student-dashboard-service";

interface StudentStore {
  metrics: StudentMetrics | null;
  savedJobIds: string[];
  notificationsCount: number;
  setMetrics: (metrics: StudentMetrics) => void;
  setSavedJobIds: (ids: string[]) => void;
  toggleSavedJobId: (jobId: string) => void;
  setNotificationsCount: (count: number) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  metrics: null,
  savedJobIds: [],
  notificationsCount: 3,

  setMetrics: (metrics) => set({ metrics }),
  setSavedJobIds: (savedJobIds) => set({ savedJobIds }),
  toggleSavedJobId: (jobId) =>
    set((state) => ({
      savedJobIds: state.savedJobIds.includes(jobId)
        ? state.savedJobIds.filter((id) => id !== jobId)
        : [...state.savedJobIds, jobId],
    })),
  setNotificationsCount: (notificationsCount) => set({ notificationsCount }),
}));
