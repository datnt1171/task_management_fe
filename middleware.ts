import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const token = request.cookies.get("access_token")?.value

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // If no token and trying to access a protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If token exists and trying to access login page, redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
}
