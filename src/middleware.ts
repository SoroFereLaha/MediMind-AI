
// This is a placeholder middleware.
// If you don't need any middleware functionality, you can delete this file.
// It no longer references next-intl.
export function middleware(request: Request) {
  // The middleware function must exist, but it can do nothing.
  // console.log('Middleware processed request:', request.url);
  return;
}

// The config object is optional.
// If omitted, the middleware applies to all paths by default.
// To restrict it, uncomment and define a matcher.
// export const config = {
//   matcher: [
//     // Example: Match all paths except for API routes, static files, and image optimization files
//     // '/((?!api|_next/static|_next/image|favicon.ico).*)'
//   ],
// };
