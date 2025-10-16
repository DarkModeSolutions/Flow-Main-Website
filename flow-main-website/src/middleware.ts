import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware - Requested Path:", pathname);

  // ✅ Only protect specific admin routes, not auth routes
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/auth");

  const isProtectedApiRoute = pathname.startsWith("/api/admin");

  if (isProtectedAdminRoute || isProtectedApiRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Middleware token:", token);

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      return NextResponse.redirect(new URL("/admin/auth/login", req.url));
    }

    // Check admin access
    if (!token.isAdmin) {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.redirect(new URL("/admin/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run middleware on admin routes and api routes
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
