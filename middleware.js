import { NextResponse } from 'next/server';

export function middleware(request) {
    const session = request.cookies.get('admin_session');
    const { pathname } = request.nextUrl;

    // Daftar halaman yang wajib login
    const protectedPaths = ['/list', '/upload', '/settings'];

    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/list/:path*', '/upload/:path*', '/settings/:path*'],
};
