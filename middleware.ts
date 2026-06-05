// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Paths yang memerlukan autentikasi
const protectedPaths = [
  '/admin',
  '/api/blogs',
  '/api/projects',
  '/api/upload',
];

// Methods yang memerlukan autentikasi (untuk API)
const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ PENTING: Exclude halaman login dari proteksi
  // Halaman login harus bisa diakses tanpa token
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Cek apakah path dilindungi
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Untuk halaman admin (/admin), redirect ke login jika belum auth
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Untuk API routes, cek method
  if (pathname.startsWith('/api/')) {
    const method = request.method;
    
    // GET requests untuk blogs/projects tidak perlu auth (public)
    if (method === 'GET') {
      return NextResponse.next();
    }

    // POST/PUT/DELETE memerlukan auth
    if (protectedMethods.includes(method)) {
      const token = request.cookies.get('admin_token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const isValid = await verifyToken(token);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/blogs/:path*',
    '/api/projects/:path*',
    '/api/upload',
  ],
};