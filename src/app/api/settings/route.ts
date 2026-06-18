import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listSettings } from '@/lib/firestore/app-data';
import { createSetting } from '@/lib/firestore/app-writes';
import { createSettingSchema } from '@/lib/validation/entities';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const settings = await listSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list settings' }, { status: 500 });
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
    const validated = createSettingSchema.parse(body);
    const setting = await createSetting(validated);
    return NextResponse.json({ success: true, data: setting }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create setting' }, { status: 400 });
  }
}
