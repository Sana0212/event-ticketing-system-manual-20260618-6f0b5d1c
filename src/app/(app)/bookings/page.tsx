import React, { Suspense } from 'react';
import Link from 'next/link';
import { listBookings, listEvents, listTicketTypes } from '@/lib/firestore/app-data';
import BookingsTable from '@/modules/bookings/components/BookingsTable';
import { ClipboardList, Plus, FileText, CalendarDays } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookingsListPage() {
  const [bookings, events, ticketTypes] = await Promise.all([
    listBookings(),
    listEvents(),
    listTicketTypes(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-650" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Guest Bookings
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Monitor transaction references, payment parameters, check-in statuses, and customer data.
          </p>
        </div>

        <div>
          <Link
            href="/bookings/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4.5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-650 transition-colors"
          >
            <Plus className="h-4.5 w-4.5" />
            New Booking
          </Link>
        </div>
      </div>

      {/* Bookings Table container wrapper */}
      <Suspense fallback={
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-100 bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <span className="text-sm text-slate-400 font-semibold">Streaming bookings data...</span>
          </div>
        </div>
      }>
        <BookingsTable bookings={bookings} events={events} ticketTypes={ticketTypes} />
      </Suspense>
    </div>
  );
}
