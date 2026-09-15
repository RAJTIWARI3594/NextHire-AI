import { create } from "zustand";
import type {
  PlatformUser,
  RecruiterApproval,
  JobModerationItem,
  AuditLogItem,
  AdminMetrics,
} from "@/types/admin";
import { MOCK_ADMIN_METRICS, MOCK_USERS_LIST } from "@/services/admin-service";

interface AdminStore {
  metrics: AdminMetrics;
  users: PlatformUser[];
  recruiters: RecruiterApproval[];
  jobs: JobModerationItem[];
  auditLogs: AuditLogItem[];

  setMetrics: (metrics: AdminMetrics) => void;
  setUsers: (users: PlatformUser[]) => void;
  toggleUserStatus: (userId: string) => void;
  approveRecruiter: (id: string) => void;
  approveJob: (id: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  metrics: MOCK_ADMIN_METRICS,
  users: MOCK_USERS_LIST,
  recruiters: [
    {
      id: "rec-app-1",
      recruiterName: "Marcus Vance",
      companyName: "Nexus AI Intelligence",
      email: "marcus@nexusai.com",
      status: "pending",
      appliedDate: "Aug 4, 2026",
    },
  ],
  jobs: [
    {
      id: "job-mod-1",
      title: "Senior Full Stack Engineer",
      companyName: "Vercel Partner Labs",
      postedDate: "Aug 5, 2026",
      status: "active",
      reportsCount: 0,
    },
  ],
  auditLogs: [],

  setMetrics: (metrics) => set({ metrics }),
  setUsers: (users) => set({ users }),

  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      ),
    })),

  approveRecruiter: (id) =>
    set((state) => ({
      recruiters: state.recruiters.map((r) =>
        r.id === id ? { ...r, status: "approved" as const } : r
      ),
    })),

  approveJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === id ? { ...j, status: "active" as const } : j
      ),
    })),
}));
