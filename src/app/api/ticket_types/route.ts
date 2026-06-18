import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listTicketTypes } from '@/lib/firestore/app-data';
import { createTicketType } from '@/lib/firestore/app-writes';
import { createTicketTypeSchema } from '@/lib/validation/entities';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const ticketTypes = await listTicketTypes();
    return NextResponse.json({ success: true, data: ticketTypes });
  } catch (error: any) {
    console.error('Error fetching ticket types:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list ticket types' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const body = await req.json();
    const validated = createTicketTypeSchema.parse(body);

    const ticketType = await createTicketType(validated);
    return NextResponse.json({ success: true, data: ticketType }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating ticket type:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create ticket type' },
      { status: 400 }
    );
  }
}
