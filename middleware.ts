import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected route
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Skip middleware for API routes and public assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token and trying to access protected route, redirect to login
    if (!token && isProtectedRoute) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // If token exists and trying to access login/register, redirect to dashboard
    if (
      token &&
      (pathname === "/login" || pathname === "/register" || pathname === "/")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Continue for all other cases
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // If there's an error, redirect to login for protected routes
    if (isProtectedRoute) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "session");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
