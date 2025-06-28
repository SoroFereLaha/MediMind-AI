import { NextRequest, NextResponse } from 'next/server';

// Middleware de contrôle d'accès en fonction du rôle stocké dans un cookie "role"
// - /medecin/**  -> role="medecin" requis
// - /patient/**  -> role="patient" requis
// Redirige vers /403 si le rôle ne correspond pas

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  const isMedRoute = pathname === '/medecin' || pathname.startsWith('/medecin/');
  const isPatRoute = pathname === '/patient' || pathname.startsWith('/patient/');

  if ((isMedRoute && role !== 'medecin') || (isPatRoute && role !== 'patient')) {
    if (role) {
      // Rediriger vers la page 403 si le rôle est défini mais ne correspond pas
      const denied = new URL('/403', request.url);
      return NextResponse.redirect(denied);
    }
    // Si pas de rôle défini, on laisse passer pour permettre la sélection du rôle
  }

  return NextResponse.next();
}

// Appliquer uniquement sur ces chemins
export const config = {
  // Matcher toutes les routes sauf les assets et _next
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(fr|en)/:path*',
    // Enable redirects that add missing locales
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};