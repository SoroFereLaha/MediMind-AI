
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import type { NextRequest } from 'next/server';

console.log('@@@@@@@@@@ [middleware.ts] Initializing next-intl middleware (top level) @@@@@@@@@@');
console.log(`[middleware.ts] Config: defaultLocale: ${defaultLocale}, locales: ${locales.join(', ')}`);

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // This is important
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[middleware.ts] Request received for: ${pathname}`);

  // Check if the path is for a static file or API route to potentially bypass intlMiddleware
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/_next/image/') ||
    pathname.includes('.') // Generally, paths with dots are for files
  ) {
    console.log(`[middleware.ts] Bypassing next-intl middleware for path: ${pathname}`);
    return; // Allow request to proceed without i18n handling
  }

  console.log(`[middleware.ts] Applying next-intl middleware for path: ${pathname}`);
  const response = intlMiddleware(request);
  console.log(`[middleware.ts] next-intl middleware processed. Response status: ${response.status}, Location header: ${response.headers.get('Location')}`);
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel` (already handled by above if-condition but good for explicit exclusion)
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)']
};

console.log('[middleware.ts] Middleware configured with matcher:', JSON.stringify(config.matcher));
