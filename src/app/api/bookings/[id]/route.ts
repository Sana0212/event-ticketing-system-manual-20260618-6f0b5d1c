import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getBooking } from '@/lib/firestore/app-data';
import { updateBooking, deleteBooking } from '@/lib/firestore/app-writes';
import { updateBookingSchema } from '@/lib/validation/entities';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await props.params;
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const booking = await getBooking(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error(`Error loading booking ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await props.params;
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    const validated = updateBookingSchema.parse(body);

    const booking = await updateBooking(id, validated);
    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error(`Error updating booking ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await props.params;
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const booking = await getBooking(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await deleteBooking(id);
    return NextResponse.json({ success: true, message: 'Booking deleted' });
  } catch (error: any) {
    console.error(`Error deleting booking ${id}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete booking' }, { status: 500 });
  }
}
