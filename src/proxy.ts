import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    request.nextUrl.pathname !== "/dashboard/login"
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/login";
      url.search = "";
      const redirect = NextResponse.redirect(url);
      redirect.headers.set("Cache-Control", "private, no-store");
      response.cookies
        .getAll()
        .forEach((cookie) => redirect.cookies.set(cookie));
      return redirect;
    }
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) {
      const denied = new NextResponse("403 — Admin access required", {
        status: 403,
        headers: { "Cache-Control": "private, no-store" },
      });
      response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
      return denied;
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard"))
    response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
