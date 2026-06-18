import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getVenue } from '@/lib/firestore/app-data';
import { updateVenue, deleteVenue } from '@/lib/firestore/app-writes';
import { updateVenueSchema } from '@/lib/validation/entities';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const venue = await getVenue(id);
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: venue });
  } catch (error: any) {
    console.error('Error fetching venue:', error);
    return NextResponse.json({ error: error.message || 'Failed to get venue' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const body = await req.json();

    if (body.capacity !== undefined) {
      body.capacity = Number(body.capacity);
    }

    const validated = updateVenueSchema.parse(body);
    const venue = await updateVenue(id, validated);
    
    return NextResponse.json({ success: true, data: venue });
  } catch (error: any) {
    console.error('Error updating venue:', error);
    return NextResponse.json({ error: error.message || 'Failed to update venue' }, { status: 400 });
  }
}

export async function DELETE(req: Request, props: RouteParams): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  const { id } = await props.params;

  try {
    const venue = await getVenue(id);
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }
    
    await deleteVenue(id);
    return NextResponse.json({ success: true, message: 'Venue successfully deleted' });
  } catch (error: any) {
    console.error('Error deleting venue:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete venue' }, { status: 500 });
  }
}
