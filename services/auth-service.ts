import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { displayNameFromEmail } from "@/lib/utils";
import type {
  StudentSignupFormData,
  RecruiterSignupFormData,
  LoginFormData,
} from "@/lib/validations/auth";
import type { Profile, StudentProfile, RecruiterProfile } from "@/types/auth";

function ensureDemoAuthAllowed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Authentication is temporarily unavailable because the authentication service is not configured."
    );
  }
}

export async function signUpStudent(data: StudentSignupFormData) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    return {
      user: {
        id: "demo-student-id",
        email: data.email,
        user_metadata: {
          role: "student",
          full_name: data.fullName,
        },
      },
    };
  }

  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: "student",
        college: data.college,
        course: data.course,
        graduationYear: String(data.graduationYear),
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (authError) throw authError;

  return authData;
}

export async function signUpRecruiter(data: RecruiterSignupFormData) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    return {
      user: {
        id: "demo-recruiter-id",
        email: data.companyEmail,
        user_metadata: { role: "recruiter", full_name: data.fullName },
      },
    };
  }

  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.companyEmail,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: "recruiter",
        company_name: data.companyName,
        company_website: data.companyWebsite,
        designation: data.designation,
        company_email: data.companyEmail,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (authError) throw authError;

  return authData;
}

export async function signInWithEmail(data: LoginFormData) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    // Determine demo role from email pattern or default to student
    let role = "student";
    if (data.email.includes("admin")) role = "admin";
    else if (data.email.includes("recruiter")) role = "recruiter";

    return {
      user: {
        id: `demo-${role}-id`,
        email: data.email,
        user_metadata: { role, full_name: displayNameFromEmail(data.email) },
      },
    };
  }

  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  return authData;
}

export async function signInWithOAuth(provider: "google" | "github") {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    window.location.href = "/dashboard";
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function sendPasswordResetEmail(email: string) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    return { sent: true, demo: true };
  }
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return { sent: true };
}

export async function updateUserPassword(newPassword: string) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    return { updated: true, demo: true };
  }
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return { updated: true };
}

export async function getUserProfile(authUserId: string) {
  if (!isSupabaseConfigured()) {
    ensureDemoAuthAllowed();
    let role: "student" | "recruiter" | "admin" = "student";
    if (authUserId.includes("admin")) role = "admin";
    else if (authUserId.includes("recruiter")) role = "recruiter";

    const email = `user@${role === "student" ? "demo" : role}.nexthire.ai`;

    return {
      profile: {
        id: "demo-profile-id",
        auth_user_id: authUserId,
        email,
        full_name: displayNameFromEmail(email),
        avatar_url: "",
        role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile,
      studentProfile: null,
      recruiterProfile: null,
    };
  }

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .single();

  if (error) return null;

  let studentProfile: StudentProfile | null = null;
  let recruiterProfile: RecruiterProfile | null = null;

  if (profile.role === "student") {
    const { data: sProfile } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .single();
    studentProfile = sProfile;
  } else if (profile.role === "recruiter") {
    const { data: rProfile } = await supabase
      .from("recruiter_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .single();
    recruiterProfile = rProfile;
  }

  return { profile: profile as Profile, studentProfile, recruiterProfile };
}
