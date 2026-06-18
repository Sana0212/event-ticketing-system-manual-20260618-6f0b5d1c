import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listUsers } from '@/lib/firestore/app-data';
import { createUser } from '@/lib/firestore/app-writes';
import { createUserSchema } from '@/lib/validation/entities';
import { hashPassword } from '@/lib/auth/user-store';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const users = await listUsers();
    // Return sorted clean list (exclude password hash in response)
    const sanitized = users.map((u) => {
      const { password_hash, ...rest } = u;
      return rest;
    });
    return NextResponse.json({ success: true, users: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const rawPassword = body.password_hash || 'Password123!';
    body.password_hash = hashPassword(rawPassword);

    const validated = createUserSchema.parse(body);
    const user = await createUser(validated);
    const { password_hash, ...sanitized } = user;
    return NextResponse.json({ success: true, user: sanitized }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 400 });
  }
}
