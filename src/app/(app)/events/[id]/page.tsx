import { getEvent, getVenue, getUser, listTicketTypesByEvent } from '@/lib/firestore/app-data';
import { getSession } from '@/lib/auth/session';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  ShieldAlert, 
  User, 
  CheckCircle, 
  Pencil, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  // Ensure authorized roles: ["admin","event_organizer","venue_manager","support"]
  const allowedRoles = ['admin', 'event_organizer', 'venue_manager', 'support'];
  if (!allowedRoles.includes(session.role)) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-rose-600" />
        <h2 className="text-lg font-bold">Access Restricted</h2>
        <p className="mt-1 text-sm">Your designated user account role is not permitted to view event details.</p>
      </div>
    );
  }

  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  // Gather other relational data
  const [venue, organizer, ticketTypes] = await Promise.all([
    event.venue_id ? getVenue(event.venue_id) : Promise.resolve(null),
    event.organizer_id ? getUser(event.organizer_id) : Promise.resolve(null),
    listTicketTypesByEvent(event.id),
  ]);

  const formatDate = (val: any) => {
    if (!val) return 'Infinite Deadline';
    const date = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusLabelMap: Record<string, string> = {
    draft: 'Draft (Draft Mode)',
    published: 'Published (Active)',
    cancelled: 'Cancelled',
    completed: 'Event Completed',
  };

  return (
    <div className="space-y-6">
      {/* Search and Navigation crumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/events" className="hover:text-slate-800">Events</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[200px] md:max-w-none">{event.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to roster
          </Link>
          {(session.role === 'admin' || session.role === 'event_organizer') && (
            <Link
              href={`/events/${event.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modify Config
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Body Layout & Sidebar specs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Main Details Panel */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest border border-indigo-100 mb-3">
                  {event.category || 'General Outing'}
                </span>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl font-mono">
                  {event.name}
                </h1>
              </div>
              <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold border ${
                  event.status === 'published' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : event.status === 'draft' 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  {statusLabelMap[event.status] || event.status}
                </span>
              </div>
            </div>

            {/* Description or Logistics details */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Description / Travel Specs</h3>
              <p className="text-slate-650 leading-relaxed text-sm whitespace-pre-wrap">
                {event.description || 'No descriptive literature or special schedule highlights have been added to this event specification.'}
              </p>
            </div>
          </div>

          {/* Ticket types configured for this event */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4.5 flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Tag className="h-4 w-4 text-indigo-500" />
                Ticket Types & Inventory Allocations
              </h3>
              {(session.role === 'admin' || session.role === 'event_organizer') && (
                <Link
                  href={`/tickets/create?event_id=${event.id}`}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                >
                  Configure Ticket
                </Link>
              )}
            </div>
            
            <div className="divide-y divide-slate-100">
              {ticketTypes.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  There are no ticket pricing classes established for this event blueprint yet.
                </div>
              ) : (
                ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{ticket.name}</h4>
                      {ticket.description && (
                        <p className="text-xs text-slate-500 mt-1 max-w-md">{ticket.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                        <span>Max per booking: {ticket.max_per_booking || 'No Limit'}</span>
                        <span>•</span>
                        <span>Inventory: {ticket.total_quantity} total</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right shrink-0">
                      <div className="text-lg font-extrabold text-slate-900">
                        {ticket.price === 0 ? 'FREE' : `${ticket.currency || 'USD'} ${ticket.price.toFixed(2)}`}
                      </div>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border mt-1.5 ${
                        ticket.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          {/* Scheduling Metadata */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Event Logistics
            </h3>

            <div className="space-y-3.5">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="block font-semibold text-slate-900">Begins</span>
                  <span className="text-xs text-slate-500">{formatDate(event.start_datetime)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="block font-semibold text-slate-900">Concludes</span>
                  <span className="text-xs text-slate-500">{formatDate(event.end_datetime)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="block font-semibold text-slate-900">Local Timezone</span>
                  <span className="text-xs text-slate-500">{event.timezone || 'America/New_York'}</span>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-3.5">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="block font-semibold text-slate-900">Booking Deadline</span>
                  <span className="text-xs text-slate-500">
                    {event.booking_deadline ? formatDate(event.booking_deadline) : 'Available until event start'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Capacity Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Venue details
            </h3>

            {venue ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="block font-bold text-slate-900">{venue.name}</span>
                    <span className="text-xs text-slate-500 leading-relaxed">{venue.location}</span>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-3.5">
                  <Users className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="block font-semibold text-slate-900">Capacity & Allocations</span>
                    <span className="text-xs text-slate-500">
                      Target Capacity: <strong className="text-slate-950">{event.capacity || venue.capacity}</strong> (Venue total capacity: {venue.capacity})
                    </span>
                  </div>
                </div>

                {venue.contact_name && (
                  <div className="flex gap-3 border-t border-slate-100 pt-3">
                    <User className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="block font-semibold text-slate-900">Venue Contact Guard</span>
                      <span className="text-xs text-slate-500">{venue.contact_name} {venue.contact_phone ? `(${venue.contact_phone})` : ''}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No hospitality venue is currently designated for this schedule arrangement.</p>
            )}
          </div>

          {/* Organizer Meta Guard */}
          {organizer && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Assigned Organizer
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold font-mono">
                  {organizer.first_name[0]}{organizer.last_name[0]}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900">{organizer.first_name} {organizer.last_name}</span>
                  <span className="block text-xs text-slate-500">{organizer.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
