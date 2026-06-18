import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import VenueCreateForm from '@/modules/venues/components/VenueCreateForm';

export const dynamic = 'force-dynamic';

export default function CreateVenuePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/venues"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Venues
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
          <Building2 className="h-4 w-4" />
          <span>New Venue Config</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create Venue
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter seating limits, coordinates, property specifications and primary coordinator details.
        </p>
      </div>

      {/* Form */}
      <VenueCreateForm />
    </div>
  );
}
