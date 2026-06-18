import React from 'react';
import Link from 'next/link';
import { listEvents, listTicketTypes } from '@/lib/firestore/app-data';
import BookingCreateForm from '@/modules/bookings/components/BookingCreateForm';
import { ArrowLeft, ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookingCreatePage() {
  const [events, ticketTypes] = await Promise.all([
    listEvents(),
    listTicketTypes(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Bookings
        </Link>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Issue New Booking
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Book standard event spots manually for custom customers, VIP entities, or external ticket agents.
        </p>
      </div>

      {/* Form Container Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <BookingCreateForm events={events} ticketTypes={ticketTypes} />
      </div>
    </div>
  );
}
