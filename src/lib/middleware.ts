import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get("auth_token")?.value

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  try {
    // Verify token
    verify(token, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

