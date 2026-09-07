import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/auth/2fa/setup",
  "/auth/2fa/verify",
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/settings": ["superadmin", "admin"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookies sent with the HTTP request
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  // Consider user authenticated if either refresh_token OR user_role cookie is present
  const isAuthenticated = Boolean(refreshToken || userRole);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 1. Redirect unauthenticated users accessing protected dashboard
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages
  if (isPublicRoute && isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Role Permission Enforcement for matching sub-routes
  if (isDashboardRoute && userRole) {
    const matchedRoute = Object.keys(ROLE_PERMISSIONS).find((route) =>
      pathname.startsWith(route)
    );

    if (matchedRoute) {
      const allowedRoles = ROLE_PERMISSIONS[matchedRoute];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/auth/:path*",
  ],
};
