// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const publicRoutes = ['/', '/auth/login', '/auth/register'];
  const { pathname } = request.nextUrl;

  // Obtener el token de la cookie
  const token = request.cookies.get('auth-token')?.value;

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verificar token
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Manejo de roles
      if (payload.role === 'AGENT' || payload.role === 'USER') {
        // Permitir acceso a rutas de AGENT y USER
        return NextResponse.next();
      } else {
        // Redirigir si el rol no es válido
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

    } catch (error) {
      // Token inválido o expirado
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};