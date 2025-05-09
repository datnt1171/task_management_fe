import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/"

  // Get the token from cookies
  const token = request.cookies.get("access_token")?.value || ""

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on login page but has token, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !token) {
    // If user is trying to access protected route without token, redirect to login
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
