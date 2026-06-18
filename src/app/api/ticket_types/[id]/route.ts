import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { getTicketType } from '@/lib/firestore/app-data';
import { updateTicketType, deleteTicketType } from '@/lib/firestore/app-writes';
import { updateTicketTypeSchema } from '@/lib/validation/entities';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, props: RouteContext): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const { id } = await props.params;
    const ticketType = await getTicketType(id);
    if (!ticketType) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: ticketType });
  } catch (error: any) {
    console.error('Error fetching ticket type:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve ticket type' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, props: RouteContext): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const { id } = await props.params;
    const body = await req.json();
    const validated = updateTicketTypeSchema.parse(body);

    const updated = await updateTicketType(id, validated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating ticket type:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket type' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, props: RouteContext): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const { id } = await props.params;
    await deleteTicketType(id);
    return NextResponse.json({ success: true, message: 'Ticket type deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting ticket type:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete ticket type' },
      { status: 500 }
    );
  }
}
