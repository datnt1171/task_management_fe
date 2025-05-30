import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const response = intlMiddleware(request);

  // If redirected by locale detection, return early
  if (response && response.status >= 300 && response.status < 400) {
    return response;
  }

  const pathname = request.nextUrl.pathname;

  // Determine locale from path
  const locale =
    routing.locales.find((loc) =>
      pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
    ) || routing.defaultLocale;

  // Strip locale from path
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';

  // Get auth token
  const token = request.cookies.get("access_token")?.value;

  const publicPaths = ["/", "/login"];
  const isPublicPath = publicPaths.some((path) =>
    pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  );

  // Redirect unauthenticated users
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect logged-in users away from login or root
  if (token && ["/login", "/"].includes(pathWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
