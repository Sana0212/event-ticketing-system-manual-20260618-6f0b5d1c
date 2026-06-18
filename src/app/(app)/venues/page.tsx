import { listVenues } from '@/lib/firestore/app-data';
import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import VenuesTable from '@/modules/venues/components/VenuesTable';

export const dynamic = 'force-dynamic';

export default async function VenuesPage() {
  const venues = await listVenues();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Building2 className="h-4 w-4" />
            <span>Hospitality & Events</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Venues
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Define properties, capacity tiers, and locations for seating arrangements.
          </p>
        </div>
        <div>
          <Link
            href="/venues/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Venue
          </Link>
        </div>
      </div>

      {/* Main Table view */}
      <VenuesTable venues={venues} />
    </div>
  );
}
