import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listEvents } from '@/lib/firestore/app-data';
import { createEvent } from '@/lib/firestore/app-writes';
import { createEventSchema } from '@/lib/validation/entities';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const events = await listEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message || 'Failed to list events' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();

    // Ensure capacity is a number if supplied
    if (body.capacity !== undefined && body.capacity !== null && body.capacity !== '') {
      body.capacity = Number(body.capacity);
    } else {
      delete body.capacity;
    }

    // Validate body via Zod
    const validated = createEventSchema.parse({
      ...body,
      organizer_id: authVal.session.userId, // Organizer is current user
    });

    const event = await createEvent(validated);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 400 });
  }
}
