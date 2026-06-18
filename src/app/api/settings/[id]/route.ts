import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/firestore/app-data';
import { updateSetting, deleteSetting } from '@/lib/firestore/app-writes';
import { updateSettingSchema } from '@/lib/validation/entities';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const setting = await getSetting(id);
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get setting' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    const body = await req.json();
    const validated = updateSettingSchema.parse(body);
    const setting = await updateSetting(id, validated);
    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update setting' }, { status: 400 });
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
    const setting = await getSetting(id);
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }
    
    await deleteSetting(id);
    return NextResponse.json({ success: true, message: 'Setting successfully deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete setting' }, { status: 500 });
  }
}
