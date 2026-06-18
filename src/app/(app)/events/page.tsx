import { listEvents, listVenues, listUsers } from '@/lib/firestore/app-data';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Calendar, Info } from 'lucide-react';
import EventsTable from '@/modules/events/components/EventsTable';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Check roles permitted: ["admin","event_organizer","venue_manager","support"]
  const allowedRoles = ['admin', 'event_organizer', 'venue_manager', 'support'];
  if (!allowedRoles.includes(session.role)) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
        <Info className="mx-auto mb-3 h-10 w-10 text-rose-600" />
        <h2 className="text-lg font-bold">Access Restricted</h2>
        <p className="mt-1 text-sm">Your designated user role does not have authorization to view the events table.</p>
      </div>
    );
  }

  // Load backend dependencies
  const [events, venues, users] = await Promise.all([
    listEvents(),
    listVenues(),
    listUsers(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Info */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-mono">Organization Events</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Define, assign venues, scheduling, and manage ticketing allocations for your travel & holiday outings.
          </p>
        </div>
        
        {/* Create Event CTA (Only allowed for Admin & Event Organizer) */}
        {(session.role === 'admin' || session.role === 'event_organizer') && (
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5.5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            New Event Blueprint
          </Link>
        )}
      </div>

      {/* Events Table component */}
      <EventsTable
        events={events}
        venues={venues}
        users={users}
        currentUserRole={session.role}
      />
    </div>
  );
}
