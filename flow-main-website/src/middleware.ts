import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Paths that should be accessible without authentication
// const PUBLIC_PATHS = [
//   "/auth/sign-in",
//   "/auth/sign-up",
//   "/api/auth",
//   "/",
//   "/about",
//   // Remove /api/admin from here!
// ];

// Protected paths that need authentication
const PROTECTED_PATHS = [
  "/api/admin", // Move it here instead
  "/admin",
];

// Next.js system paths that should always be public
const SYSTEM_PATHS = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/public",
  "/assets",
  "/static",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware - Requested Path:", pathname);

  // Allow system paths
  if (SYSTEM_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow public paths
  //   if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
  //     return NextResponse.next();
  //   }

  // Check if path needs protection
  const needsAuth = PROTECTED_PATHS.some(
    (path) => pathname.startsWith(path) && pathname !== "/api/admin/auth/login"
  );

  if (needsAuth) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Middleware token:", token);

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check admin access for admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!token.isAdmin) {
        // Use isAdmin instead of role
        if (pathname.startsWith("/api/")) {
          return new NextResponse(
            JSON.stringify({ error: "Admin access required" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Specify which paths to run the middleware on
export const config = {
  matcher: [
    // Match all paths except:
    // 1. Public routes (auth pages, api routes, admin auth pages/routes)
    // 2. Static files and assets
    // 3. System files (favicon, robots.txt, etc.)
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public/|assets/|static/).*)",
  ],
};
