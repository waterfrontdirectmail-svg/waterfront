import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = [
  "/",
  "/explore",
  "/forgot-password",
  "/reset-password",
];

// Redirect auth pages to homepage form for now
const REDIRECT_TO_FORM = ["/login", "/signup", "/verify"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (REDIRECT_TO_FORM.includes(pathname)) return true;
  if (pathname.startsWith("/api/public/")) return true;
  if (pathname.startsWith("/go/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect login/signup to homepage form
  if (REDIRECT_TO_FORM.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.hash = "get-started";
    return NextResponse.redirect(url);
  }

  // Public routes — skip Supabase entirely
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Protected routes — need Supabase session
  const { user, response, supabase } = await updateSession(request);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.hash = "get-started";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.hash = "get-started";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
