import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getUser } from '@/lib/firestore/app-data';
import { updateUser, deleteUser } from '@/lib/firestore/app-writes';
import { updateUserSchema } from '@/lib/validation/entities';
import { hashPassword } from '@/lib/auth/user-store';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  // Let admins manage anyone, others can only view/update their own profile
  if (authVal.session.role !== 'admin' && authVal.session.userId !== id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const user = await getUser(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { password_hash, ...sanitized } = user;
    return NextResponse.json({ success: true, data: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get user' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  if (authVal.session.role !== 'admin' && authVal.session.userId !== id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (body.password_hash && !body.password_hash.startsWith('$') && body.password_hash.length < 50) {
      body.password_hash = hashPassword(body.password_hash);
    }

    const validated = updateUserSchema.parse(body);
    const user = await updateUser(id, validated);
    const { password_hash, ...sanitized } = user;
    return NextResponse.json({ success: true, data: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const user = await getUser(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    await deleteUser(id);
    return NextResponse.json({ success: true, message: 'User successfully deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
