import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getEvent } from '@/lib/firestore/app-data';
import { updateEvent, deleteEvent } from '@/lib/firestore/app-writes';
import { updateEventSchema } from '@/lib/validation/entities';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const event = await getEvent(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch event blueprint' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const body = await req.json();

    // Ensure capacity is a number if supplied
    if (body.capacity !== undefined && body.capacity !== null && body.capacity !== '') {
      body.capacity = Number(body.capacity);
    } else if (body.capacity === null || body.capacity === '') {
      body.capacity = undefined;
    }

    // Validate body via Zod
    const validated = updateEventSchema.parse(body);

    const updated = await updateEvent(id, validated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: error.message || 'Failed to update event' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  // Let's enforce that only admin can delete events per app spec
  if (authVal.session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden. Only Admins can delete events.' }, { status: 403 });
  }

  const { id } = await props.params;

  try {
    await deleteEvent(id);
    return NextResponse.json({ success: true, message: 'Event successfully deleted' });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete event' }, { status: 500 });
  }
}
