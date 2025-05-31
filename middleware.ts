import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the base next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const token = request.cookies.get('access_token')?.value;

  const { pathname } = request.nextUrl;

  // Extract the locale (e.g. "/en/dashboard" → "en")
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Define public paths (e.g. "/en/login" or "/vn/login")
  const isPublicPath = ['/', '/login'].includes(pathWithoutLocale);

  // Redirect if no token and accessing a protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect if token exists but accessing public path (e.g. login)
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  // Matches all paths except:
  // - static files
  // - API routes
  // - _next, _vercel, etc.
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
