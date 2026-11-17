import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, getSupabaseEnv } from "./env";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/academy",
  "/practice",
  "/progress",
  "/profile",
  "/onboarding",
];
const AUTH_PAGES = ["/login", "/register"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return response;

  const { url, key } = getSupabaseEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims(). getClaims() refreshes an expired
  // session (writing the new cookies above) and verifies the token with the project's public
  // key locally, so most clicks no longer wait on the Auth server here.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims?.sub ? data.claims : null;

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  if (!user && isProtected) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    redirect.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(redirect);
  }

  if (user && AUTH_PAGES.includes(path)) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/dashboard";
    redirect.search = "";
    return NextResponse.redirect(redirect);
  }

  return response;
}
