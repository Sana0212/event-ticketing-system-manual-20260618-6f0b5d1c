'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { EventRecord } from '@/data/types';

interface TicketTypeCreateFormProps {
  events: EventRecord[];
  initialEventId?: string;
}

export default function TicketTypeCreateForm({ events, initialEventId }: TicketTypeCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states matching fields listed in ticket_type_create_form:
  // ["event_id","name","description","price","currency","total_quantity","max_per_booking","sales_start","sales_end","status"]
  const [eventId, setEventId] = useState(initialEventId || events[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [totalQuantity, setTotalQuantity] = useState<number>(100);
  const [maxPerBooking, setMaxPerBooking] = useState<number>(10);
  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('');
  const [status, setStatus] = useState('Active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      setError('Please select an event first.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      event_id: eventId,
      name,
      description: description || undefined,
      price: Number(price),
      currency,
      total_quantity: Number(totalQuantity),
      max_per_booking: maxPerBooking ? Number(maxPerBooking) : undefined,
      sales_start: salesStart ? new Date(salesStart).toISOString() : undefined,
      sales_end: salesEnd ? new Date(salesEnd).toISOString() : undefined,
      status,
    };

    try {
      const res = await fetch('/api/ticket_types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to create ticket type');
      }

      router.push(`/tickets/${result.data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating ticket type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-start gap-2.5">
          <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Event Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Event <span className="text-red-500">*</span>
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="" disabled>-- Select Event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket Type Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Ticket Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. general VIP Pass, Early Bird"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              step="0.01"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        {/* Total Quantity */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Total Inventory Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="1"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Max Per Booking */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Max quantity per purchase booking
          </label>
          <input
            type="number"
            min="1"
            value={maxPerBooking}
            onChange={(e) => setMaxPerBooking(Number(e.target.value))}
            placeholder="e.g. 5"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Sales Start Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Sales Start Date &amp; Time
          </label>
          <input
            type="datetime-local"
            value={salesStart}
            onChange={(e) => setSalesStart(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Sales End Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Sales End Date &amp; Time
          </label>
          <input
            type="datetime-local"
            value={salesEnd}
            onChange={(e) => setSalesEnd(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Active">Active / On Sale</option>
            <option value="Paused">Paused</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what's included with this ticket..."
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            router.push('/tickets');
            router.refresh();
          }}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Ticket Type
        </button>
      </div>
    </form>
  );
}
