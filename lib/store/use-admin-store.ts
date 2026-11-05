import { create } from "zustand";
import type {
  PlatformUser,
  RecruiterApproval,
  JobModerationItem,
  AuditLogItem,
  AdminMetrics,
} from "@/types/admin";
import { EMPTY_ADMIN_METRICS } from "@/services/admin-service";

interface AdminStore {
  metrics: AdminMetrics;
  users: PlatformUser[];
  recruiters: RecruiterApproval[];
  jobs: JobModerationItem[];
  auditLogs: AuditLogItem[];

  setMetrics: (metrics: AdminMetrics) => void;
  setUsers: (users: PlatformUser[]) => void;
  setRecruiters: (recruiters: RecruiterApproval[]) => void;
  toggleUserStatus: (userId: string) => void;
  approveRecruiter: (id: string) => void;
  approveJob: (id: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  metrics: EMPTY_ADMIN_METRICS,
  users: [],
  recruiters: [],
  jobs: [],
  auditLogs: [],

  setMetrics: (metrics) => set({ metrics }),
  setUsers: (users) => set({ users }),
  setRecruiters: (recruiters) => set({ recruiters }),

  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "suspended" : "active" }
          : user
      ),
    })),

  approveRecruiter: (id) =>
    set((state) => ({
      recruiters: state.recruiters.map((recruiter) =>
        recruiter.id === id
          ? { ...recruiter, status: "approved" as const }
          : recruiter
      ),
    })),

  approveJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, status: "active" as const } : job
      ),
    })),
}));
