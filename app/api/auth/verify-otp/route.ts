import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';
import { db } from '@/lib/db';
import { user as userTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string') {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // OTP is valid - check if user exists
    const normalizedEmail = email.toLowerCase().trim();
    let existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    let userId: string;

    if (existingUser.length === 0) {
      // Create new user
      const newUser = await db
        .insert(userTable)
        .values({
          id: crypto.randomUUID(),
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0], // Use email prefix as default name
          emailVerified: true, // OTP verification confirms email
          createdAt: new Date(),
          updatedAt: new Date(),
          role: 'user',
        })
        .returning();

      userId = newUser[0].id;
    } else {
      userId = existingUser[0].id;
      
      // Update emailVerified if not already verified
      if (!existingUser[0].emailVerified) {
        await db
          .update(userTable)
          .set({ 
            emailVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(userTable.id, userId));
      }
    }

    // Create session using Better Auth
    // We'll use Better Auth's session creation by making an internal request
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
    
    // Generate a session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Import session table
    const { session: sessionTable } = await import('@/lib/schema');

    // Create session directly in database
    await db.insert(sessionTable).values({
      id: crypto.randomUUID(),
      userId: userId,
      token: sessionToken,
      expiresAt: expiresAt,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      userAgent: request.headers.get('user-agent') || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json(
      { 
        message: 'OTP verified successfully',
        user: {
          id: userId,
          email: normalizedEmail,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
