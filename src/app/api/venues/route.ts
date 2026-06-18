import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listVenues } from '@/lib/firestore/app-data';
import { createVenue } from '@/lib/firestore/app-writes';
import { createVenueSchema } from '@/lib/validation/entities';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const venues = await listVenues();
    return NextResponse.json({ success: true, data: venues });
  } catch (error: any) {
    console.error('Error fetching venues:', error);
    return NextResponse.json({ error: error.message || 'Failed to list venues' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    
    // Ensure capacity is a number
    if (body.capacity !== undefined) {
      body.capacity = Number(body.capacity);
    }

    // Validate body via Zod
    const validated = createVenueSchema.parse(body);

    const venue = await createVenue(validated);
    return NextResponse.json({ success: true, data: venue }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating venue:', error);
    return NextResponse.json({ error: error.message || 'Failed to create venue' }, { status: 400 });
  }
}
