import { NextResponse } from 'next/server';
import { resetUserPassword } from '@/lib/auth/user-store';
import { authForgotPasswordSchema } from '@/lib/validation/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = authForgotPasswordSchema.parse(body);
    await resetUserPassword({ email, password });
    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      return NextResponse.json({ error: 'No account found for that email' }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
