'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TicketTypeCreateForm from '@/components/forms/TicketTypeCreateForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CreateTicketTypePage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ticket Types
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Create Ticket Type</h1>
        <p className="text-sm text-slate-500 mb-6 font-light">Set tier parameters and stock limits for attendee allocations.</p>
        <TicketTypeCreateForm events={events} onSuccess={() => router.push('/tickets')} />
      </div>
    </div>
  );
}
