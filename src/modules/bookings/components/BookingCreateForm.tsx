'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, ClipboardList } from 'lucide-react';
import type { EventRecord, TicketTypeRecord } from '@/data/types';

interface BookingCreateFormProps {
  events: EventRecord[];
  ticketTypes: TicketTypeRecord[];
  initialEventId?: string;
}

export default function BookingCreateForm({ events, ticketTypes, initialEventId }: BookingCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states matching fields listed in booking_create_form:
  // ["event_id","ticket_type_id","customer_name","customer_email","customer_phone","quantity","total_amount","currency","status","payment_status","booking_reference","notes"]
  const [eventId, setEventId] = useState(initialEventId || events[0]?.id || '');
  const [ticketTypeId, setTicketTypeId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('Confirmed');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [bookingReference, setBookingReference] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-generate helper reference code
  useEffect(() => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingReference(`BK-${Date.now().toString().slice(-6)}-${randomPart}`);
  }, []);

  // Filter ticket types based on selected event
  const eligibleTicketTypes = ticketTypes.filter(t => t.event_id === eventId);

  // Update selected ticket type if selected event changes
  useEffect(() => {
    if (eligibleTicketTypes.length > 0) {
      setTicketTypeId(eligibleTicketTypes[0].id);
    } else {
      setTicketTypeId('');
    }
  }, [eventId, ticketTypes]);

  // Handle price and total amount estimation
  useEffect(() => {
    const selectedTicket = ticketTypes.find(t => t.id === ticketTypeId);
    if (selectedTicket) {
      setTotalAmount(selectedTicket.price * quantity);
      setCurrency(selectedTicket.currency || 'USD');
    } else {
      setTotalAmount(0);
    }
  }, [ticketTypeId, quantity, ticketTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !ticketTypeId) {
      setError('Please select an event and ticket type.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      event_id: eventId,
      ticket_type_id: ticketTypeId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || undefined,
      quantity,
      total_amount: totalAmount,
      currency,
      status,
      payment_status: paymentStatus,
      booking_reference: bookingReference,
      notes: notes || undefined,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      router.push(`/bookings/${result.data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating booking');
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
        {/* Event selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Select Event <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 py-3 pl-3 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" disabled>-- Choose Event --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">The event the guest wants to register for</p>
        </div>

        {/* Ticket type selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Ticket Type <span className="text-red-500">*</span>
          </label>
          <select
            value={ticketTypeId}
            onChange={(e) => setTicketTypeId(e.target.value)}
            required
            disabled={!eventId}
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
          >
            <option value="" disabled>
              {eventId ? '-- Select Ticket Type --' : 'First, pick an event'}
            </option>
            {eligibleTicketTypes.map(ticket => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} ({ticket.price} {ticket.currency})
              </option>
            ))}
          </select>
          {eventId && eligibleTicketTypes.length === 0 && (
            <p className="mt-1.5 text-xs text-rose-500">No active ticket types found for this event.</p>
          )}
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Customer Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="john.doe@example.com"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Customer Phone
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Quantity / Tickets <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={50}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Booking Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Confirmed">Confirmed / Active</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Payment Status <span className="text-red-500">*</span>
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 py-3 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Payment Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Booking Reference Code */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Booking Reference <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            placeholder="E.g. BK-9281-ZKJ"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 font-mono text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-slate-400">Auto-filled unique transaction tag code</p>
        </div>

        {/* Est Total summary output */}
        <div className="flex flex-col justify-end bg-indigo-50/50 rounded-2xl p-4.5 border border-indigo-100">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Est Total Amount Due</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-1">
            {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-500">{currency}</span>
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Calculated via quantity x raw price</p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
          Special Notes & Instructions
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g. Dietary details, VIP customer requests, check-in instructions..."
          className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-3.5 border-t border-slate-150 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Issue Booking
        </button>
      </div>
    </form>
  );
}
