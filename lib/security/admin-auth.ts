import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AdminAccessResult =
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createClient>>;
      userId: string;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function requireActiveAdmin(): Promise<AdminAccessResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unable to verify administrator permissions." },
        { status: 503 }
      ),
    };
  }

  if (profile?.role !== "admin" || profile.is_suspended === true) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Active administrator access required." },
        { status: 403 }
      ),
    };
  }

  return { ok: true, supabase, userId: user.id };
}
