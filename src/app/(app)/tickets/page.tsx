'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import TicketTypesTable from '@/components/tables/TicketTypes';
import { Plus, Loader2, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TicketTypesPage() {
  const { user } = useSession();
  const router = useRouter();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [ticketsRes, eventsRes] = await Promise.all([
        fetch('/api/ticket_types'),
        fetch('/api/events'),
      ]);
      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTicketTypes(data.ticket_types || []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const canCreate = user?.role === 'admin' || user?.role === 'event_organizer';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ticket Types</h1>
          <p className="text-sm text-slate-500">Configure ticket categories, pricing, and allocation parameters.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDetails}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {canCreate && (
            <Link
              href="/tickets/create"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Create Ticket Type
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <TicketTypesTable data={ticketTypes} events={events} onDeleteSuccess={fetchDetails} />
        </div>
      )}
    </div>
  );
}
