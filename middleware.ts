import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the base next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const { pathname } = request.nextUrl;

  // Extract the potential locale from the pathname
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  // Type guard function to validate locale
  const isValidLocale = (locale: string): locale is 'en' | 'vn' => 
    routing.locales.includes(locale as 'en' | 'vn');

  // Only apply custom logic if the pathname starts with a valid locale
  if (isValidLocale(potentialLocale)) {
    const locale = potentialLocale;
    // Calculate path without locale (e.g., "/en/login" → "/login")
    const pathWithoutLocale = segments.length > 2 ? '/' + segments.slice(2).join('/') : '/';

    const token = request.cookies.get('access_token')?.value;

    // Define public paths
    const isPublicPath = ['/', '/login'].includes(pathWithoutLocale);

    // Redirect if no token and accessing a protected route
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Redirect if token exists and accessing a public path
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  // If no valid locale or no redirect needed, return the intlMiddleware response
  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};