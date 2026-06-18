import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { listVenues } from '@/lib/firestore/app-data';
import { Info } from 'lucide-react';
import EventCreateForm from '@/modules/events/components/EventCreateForm';

export const dynamic = 'force-dynamic';

export default async function CreateEventPage() {
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
        <p className="mt-1 text-sm">You do not have authorization permissions to create new events.</p>
      </div>
    );
  }

  // Need list of venues to associate
  const venues = await listVenues();

  return <EventCreateForm venues={venues} />;
}
