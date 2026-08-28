import { NextResponse, type NextRequest } from "next/server";

/* ==========================================================================
   PROXY  (formerly middleware.ts — renamed for the Next 16 convention)

   The first of two gates on /admin. This one only checks for the presence of
   a session cookie — it deliberately does NOT verify the JWT, because
   middleware runs on every matched request and the database lookup belongs in
   the route. A forged cookie gets past this and is then rejected by `auth()`
   in the layout and by `requireSession()` in every API route.

   Its real job is cheap: keep unauthenticated traffic off the admin bundle,
   and make sure nothing under /admin is ever cached or indexed.
   ========================================================================== */

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
