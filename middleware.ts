import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for a dashboard route
  const isDashboardRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/essay-writing') ||
    request.nextUrl.pathname.startsWith('/essay-test') ||
    request.nextUrl.pathname.startsWith('/essay-evaluation') ||
    request.nextUrl.pathname.startsWith('/essay-upload');

  if (isDashboardRoute) {
    // Check for authentication tokens
    const accessToken = request.cookies.get('_aT')?.value;
    
    // If no token found, redirect to home page
    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/essay-writing/:path*',
    '/essay-test/:path*',
    '/essay-evaluation/:path*',
    '/essay-upload/:path*',
  ],
};
