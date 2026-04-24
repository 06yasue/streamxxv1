import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
        
        // Set cookie session selama 7 hari
        response.cookies.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    }

    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
}
