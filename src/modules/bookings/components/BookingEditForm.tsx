'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { BookingRecord } from '@/data/types';

interface BookingEditFormProps {
  booking: BookingRecord;
}

export default function BookingEditForm({ booking }: BookingEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states matching fields listed in booking_edit_form:
  // ["customer_name","customer_email","customer_phone","quantity","total_amount","currency","status","payment_status","notes","checked_in_at"]
  const [customerName, setCustomerName] = useState(booking.customer_name || '');
  const [customerEmail, setCustomerEmail] = useState(booking.customer_email || '');
  const [customerPhone, setCustomerPhone] = useState(booking.customer_phone || '');
  const [quantity, setQuantity] = useState<number>(booking.quantity || 1);
  const [totalAmount, setTotalAmount] = useState<number>(booking.total_amount || 0);
  const [currency, setCurrency] = useState(booking.currency || 'USD');
  const [status, setStatus] = useState(booking.status || 'Confirmed');
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status || 'Paid');
  const [notes, setNotes] = useState(booking.notes || '');
  
  // checked_in_at can be parsed or toggled
  const [hasCheckedIn, setHasCheckedIn] = useState(!!booking.checked_in_at);
  const [checkedInAt, setCheckedInAt] = useState<string>(() => {
    if (!booking.checked_in_at) return '';
    try {
      const d = (booking.checked_in_at as any).seconds 
        ? new Date((booking.checked_in_at as any).seconds * 1000) 
        : new Date(booking.checked_in_at as string);
      return d.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:MM
    } catch {
      return '';
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare ISO String for checked_in_at if checked in
    let checkInVal: string | null = null;
    if (hasCheckedIn) {
      checkInVal = checkedInAt ? new Date(checkedInAt).toISOString() : new Date().toISOString();
    }

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || undefined,
      quantity,
      total_amount: totalAmount,
      currency,
      status,
      payment_status: paymentStatus,
      notes: notes || undefined,
      checked_in_at: checkInVal,
    };

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update booking');
      }

      router.push(`/bookings/${booking.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating booking');
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

      {/* Meta context info */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-4 flex gap-4 text-xs font-mono text-slate-500">
        <div>
          <span className="font-semibold block text-slate-400">REFERENCE TAG</span>
          <span className="text-slate-800 text-sm font-bold">{booking.booking_reference}</span>
        </div>
        <div className="w-[1px] bg-slate-200 self-stretch" />
        <div>
          <span className="font-semibold block text-slate-400">EVENT ID REF</span>
          <span className="text-slate-800 text-sm">{booking.event_id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Quantity booked <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Total Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">$</span>
            <input
              type="number"
              min={0}
              step="any"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
            />
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Currency <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
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
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
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
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Check in at status toggle */}
        <div className="md:col-span-2 rounded-xl border border-dashed border-slate-200 p-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasCheckedIn"
              checked={hasCheckedIn}
              onChange={(e) => {
                setHasCheckedIn(e.target.checked);
                if (e.target.checked && !checkedInAt) {
                  // Set default current time
                  const now = new Date();
                  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                  setCheckedInAt(now.toISOString().slice(0, 16));
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="hasCheckedIn" className="text-sm font-bold text-slate-800 cursor-pointer">
              Mark Booking as Checked-In
            </label>
          </div>

          {hasCheckedIn && (
            <div className="mt-3 grid gap-1.5 max-w-sm">
              <span className="text-xs text-slate-500 font-semibold">Check-In DateTime</span>
              <input
                type="datetime-local"
                value={checkedInAt}
                onChange={(e) => setCheckedInAt(e.target.value)}
                className="rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
          Special Notes & Modifications Info
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g. Reasons for refund or modification details..."
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
          Save Modifications
        </button>
      </div>
    </form>
  );
}
