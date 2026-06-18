import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { getVenue } from '@/lib/firestore/app-data';
import VenueEditForm from '@/modules/venues/components/VenueEditForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVenuePage(props: PageProps) {
  const { id } = await props.params;
  const venue = await getVenue(id);

  if (!venue) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href={`/venues/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Venue Details
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
          <Building2 className="h-4 w-4" />
          <span>Configuration Edit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit — {venue.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Modify seating capacities, change structural descriptors, or update the contact details.
        </p>
      </div>

      {/* Form */}
      <VenueEditForm venue={venue} />
    </div>
  );
}
