import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        const role = profile?.role || user.user_metadata?.role || "student";

        if (role === "recruiter") {
          return NextResponse.redirect(`${origin}/recruiter`);
        } else if (role === "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to login page on error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
