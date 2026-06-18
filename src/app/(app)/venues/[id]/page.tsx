import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  Pencil, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { getVenue, listEvents } from '@/lib/firestore/app-data';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VenueDetailPage(props: PageProps) {
  const { id } = await props.params;

  const [venue, allEvents] = await Promise.all([
    getVenue(id),
    listEvents()
  ]);

  if (!venue) {
    notFound();
  }

  // Filter events assigned to this venue
  const associatedEvents = allEvents.filter(e => e.venue_id === id);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-4 w-4" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            {status || 'Maintenance'}
          </span>
        );
    }
  };

  const formatDate = (val: any) => {
    if (!val) return 'N/A';
    const date = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar with actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/venues"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Venues
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/venues/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Pencil className="h-4 w-4 text-slate-500" />
            Edit Venue
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core details column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{venue.name}</h1>
                <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  {venue.location}
                </p>
              </div>
              <div className="shrink-0">{getStatusBadge(venue.status)}</div>
            </div>

            {venue.description && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Venue Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {venue.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Max Attendance Capacity
                </span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                  {venue.capacity.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Configured seating threshold limit
                </span>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Assigned Events
                </span>
                <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">
                  {associatedEvents.length}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Scheduled on rotation calendar
                </span>
              </div>
            </div>
          </div>

          {/* List of associated events */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-955 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Calendar Events Schedule
            </h3>
            
            {associatedEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No events currently assigned/scheduled at this venue.
              </div>
            ) : (
              <div className="grid gap-3">
                {associatedEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className="flex justify-between items-center p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl bg-white transition-all shadow-xs"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{evt.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(evt.start_datetime)} — {formatDate(evt.end_datetime)}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        evt.status === 'Published' || evt.status === 'Active'
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                          : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                      }`}>
                        {evt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact info column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Coordination & Contact
            </h3>

            {venue.contact_name ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Lead Coordinator</span>
                    <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                      {venue.contact_name}
                    </span>
                  </div>
                </div>

                {venue.contact_email && (
                  <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs text-slate-400 block">Email Address</span>
                      <a 
                        href={`mailto:${venue.contact_email}`}
                        className="text-sm font-medium text-indigo-600 hover:underline block mt-0.5 truncate"
                      >
                        {venue.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {venue.contact_phone && (
                  <div className="flex items-start gap-3 border-t border-slate-50 pt-3">
                    <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Direct Line</span>
                      <a 
                        href={`tel:${venue.contact_phone}`} 
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 block mt-0.5"
                      >
                        {venue.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                No official primary contact person is assigned yet.
              </div>
            )}
          </div>

          {/* Creation date specs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Venue ID:</span>
              <span className="font-mono text-slate-600 select-all">{venue.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Created at:</span>
              <span className="text-slate-600">{formatDate(venue.created_at)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-50 pt-2">
              <span>Last Updated:</span>
              <span className="text-slate-600">{formatDate(venue.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
