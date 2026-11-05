import { create } from "zustand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getUserProfile } from "@/services/auth-service";
import { displayNameFromEmail } from "@/lib/utils";
import type {
  Profile,
  StudentProfile,
  RecruiterProfile,
  UserRole,
} from "@/types/auth";

interface AuthStore {
  user: any | null;
  profile: Profile | null;
  studentProfile: StudentProfile | null;
  recruiterProfile: RecruiterProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  signOutStore: () => Promise<void>;
  setDemoUser: (email: string, role: UserRole) => void;
  setAuthState: (session: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  studentProfile: null,
  recruiterProfile: null,
  role: null,
  isLoading: true,
  isInitialized: false,

  setDemoUser: (email: string, role: UserRole) => {
    const fullName = displayNameFromEmail(email);
    const demoUser = {
      id: `demo-${role}-id`,
      email,
      user_metadata: { role, full_name: fullName },
    };

    const demoProfile = {
      id: "demo-profile-id",
      auth_user_id: demoUser.id,
      email,
      full_name: fullName,
      avatar_url: "",
      role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile;

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "nexthire_demo_user",
        JSON.stringify({ email, role })
      );
    }

    set({
      user: demoUser,
      profile: demoProfile,
      role,
      isLoading: false,
      isInitialized: true,
    });
  },

  setAuthState: async (session: any) => {
    if (!session?.user) {
      set({
        user: null,
        profile: null,
        studentProfile: null,
        recruiterProfile: null,
        role: null,
      });
      return;
    }
    const user = session.user;
    try {
      const profileData = await getUserProfile(user.id);
      set({
        user,
        profile: profileData?.profile || null,
        studentProfile: profileData?.studentProfile || null,
        recruiterProfile: profileData?.recruiterProfile || null,
        // Authorization role comes only from the database profile.
        role: profileData?.profile?.role || "student",
        isLoading: false,
      });
    } catch (err) {
      console.error("setAuthState error:", err);
      set({
        user,
        profile: null,
        studentProfile: null,
        recruiterProfile: null,
        role: "student",
        isLoading: false,
      });
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      if (!isSupabaseConfigured()) {
        // Demo mode: restore a previously logged-in demo session if present
        const savedDemo =
          typeof window !== "undefined"
            ? localStorage.getItem("nexthire_demo_user")
            : null;
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            if (parsed.email && parsed.role) {
              get().setDemoUser(parsed.email, parsed.role);
              return;
            }
          } catch {}
        }
        set({ isLoading: false, isInitialized: true });
        return;
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await get().setAuthState(session);
      set({ isInitialized: true });

      // Listen to Auth State Changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        await get().setAuthState(newSession);
      });
    } catch (error) {
      console.error("Auth Store Initialization Error:", error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signOutStore: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nexthire_demo_user");
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Sign out warning:", err);
      }
    }

    set({
      user: null,
      profile: null,
      studentProfile: null,
      recruiterProfile: null,
      role: null,
      isLoading: false,
    });
  },
}));
