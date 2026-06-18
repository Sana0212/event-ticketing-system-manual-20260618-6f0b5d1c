'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function TicketTypeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const ticketRes = await fetch(`/api/ticket_types/${id}`);
        if (!ticketRes.ok) throw new Error('Ticket type not found');
        const ticketData = await ticketRes.json();
        setTicket(ticketData);

        if (ticketData.event_id) {
          const eventRes = await fetch(`/api/events/${ticketData.event_id}`);
          if (eventRes.ok) {
            const eventData = await eventRes.json();
            setEvent(eventData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading || !ticket) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-slate-700">
      <Link href="/tickets" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Ticket Types
      </Link>

      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
          <div>
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-2">
              Ticket Tier
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{ticket.name}</h1>
            {ticket.description && <p className="mt-2 text-slate-500 text-sm md:text-base">{ticket.description}</p>}
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-sm text-slate-400">Price per ticket</span>
            <span className="text-3xl font-extrabold text-indigo-600">
              {ticket.price} {ticket.currency || 'USD'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Inventory & Booking Limits</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Capacity:</span>
                <span className="font-semibold text-slate-900">{ticket.total_quantity} tickets</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Max per Booking:</span>
                <span className="font-semibold text-slate-900">{ticket.max_per_booking || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status:</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Associated Event</h3>
            {event ? (
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">{event.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(event.start_datetime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-xs flex justify-between">
                  <span className="text-slate-500">Event status:</span>
                  <span className="font-medium text-slate-800 uppercase">{event.status}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-400">
                Event details could not be loaded.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link
            href={`/tickets/${ticket.id}/edit`}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Edit Ticket Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
