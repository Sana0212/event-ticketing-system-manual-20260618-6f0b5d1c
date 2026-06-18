import { getSession } from '@/lib/auth/session';
import { redirect, notFound } from 'next/navigation';
import { getEvent, listVenues } from '@/lib/firestore/app-data';
import { Info } from 'lucide-react';
import EventEditForm from '@/modules/events/components/EventEditForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Permissions check: ["admin", "event_organizer"]
  const allowed = ['admin', 'event_organizer'];
  if (!allowed.includes(session.role)) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
        <Info className="mx-auto mb-3 h-10 w-10 text-rose-600" />
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="mt-1 text-sm">You do not have administrative authorization permissions to modify existing events.</p>
      </div>
    );
  }

  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const venues = await listVenues();

  return <EventEditForm event={event} venues={venues} />;
}
