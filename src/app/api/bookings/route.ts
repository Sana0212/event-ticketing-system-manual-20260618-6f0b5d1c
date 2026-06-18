import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listBookings, listEvents, listTicketTypes } from '@/lib/firestore/app-data';
import { createBooking } from '@/lib/firestore/app-writes';
import { createBookingSchema } from '@/lib/validation/entities';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const bookings = await listBookings();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: error.message || 'Failed to list bookings' }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    
    // Generate simple readable booking reference if not provided
    if (!body.booking_reference) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      body.booking_reference = `BK-${Date.now().toString().slice(-6)}-${randomPart}`;
    }

    // Validate body via Zod
    const validated = createBookingSchema.parse(body);

    const booking = await createBooking(validated);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
