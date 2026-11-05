import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSecureCookieOptions,
  checkAdminSessionTimeout,
} from "@/lib/security/auth-security";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            const secureOpts = getSecureCookieOptions(options);
            supabaseResponse.cookies.set(name, value, secureOpts);
          });
        },
      },
    }
  );

  let user = null;
  const isDbConfigured = isSupabaseConfigured();

  if (isDbConfigured) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (err) {
      console.warn("[Middleware] Supabase auth getUser fetch warning:", err);
      user = null;
    }
  }

  const url = request.nextUrl.clone();
  const path = url.pathname;

  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password");

  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/recruiter") ||
    path.startsWith("/admin") ||
    path.startsWith("/profile");

  // Guest access blocked: Unauthenticated users are redirected to login.
  // Only enforced when real Supabase is configured (server-side session exists).
  // In demo mode (no Supabase), access control is handled client-side.
  if (
    ((!isDbConfigured && process.env.NODE_ENV === "production") ||
      (isDbConfigured && !user)) &&
    isProtectedRoute
  ) {
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Logged-in users visiting auth routes are sent to their dashboard
  if (user && isAuthRoute) {
    let role = user.user_metadata?.role || "student";
    if (role === "recruiter") url.pathname = "/recruiter";
    else if (role === "admin") url.pathname = "/admin";
    else url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Authenticated user checks
  if (user) {
    // Never trust client-editable user_metadata for authorization.
    // The database profile is the source of truth; missing profiles default to student.
    let userRole = "student";

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profile?.role) {
      userRole = profile.role;
    }

    // Admin Strict Session Timeout Check
    if (path.startsWith("/admin")) {
      const lastActiveCookie = request.cookies.get("admin_last_active")?.value;
      const lastActiveTs = lastActiveCookie
        ? parseInt(lastActiveCookie, 10)
        : undefined;
      const timeoutCheck = checkAdminSessionTimeout(lastActiveTs);

      if (timeoutCheck.isTimedOut) {
        url.pathname = "/login";
        url.searchParams.set("reason", "admin_session_timeout");
        const redirectRes = NextResponse.redirect(url);
        redirectRes.cookies.delete("admin_last_active");
        return redirectRes;
      }

      // Update admin active timestamp
      supabaseResponse.cookies.set("admin_last_active", `${Date.now()}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    if (isAuthRoute) {
      if (userRole === "recruiter") url.pathname = "/recruiter";
      else if (userRole === "admin") url.pathname = "/admin";
      else url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Role-based route authorization
    if (path.startsWith("/dashboard") && userRole !== "student") {
      url.pathname = userRole === "admin" ? "/admin" : "/recruiter";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/recruiter") && userRole !== "recruiter") {
      url.pathname = userRole === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/admin") && userRole !== "admin") {
      url.pathname = userRole === "recruiter" ? "/recruiter" : "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
