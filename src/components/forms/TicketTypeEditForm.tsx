'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface TicketTypeEditFormProps {
  id: string;
  onSuccess: () => void;
}

export default function TicketTypeEditForm({ id, onSuccess }: TicketTypeEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [totalQuantity, setTotalQuantity] = useState('100');
  const [maxPerBooking, setMaxPerBooking] = useState('10');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/ticket_types/${id}`);
        if (!res.ok) throw new Error('Failed to fetch ticket type');
        const data = await res.json();
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(String(data.price || '0'));
        setCurrency(data.currency || 'USD');
        setTotalQuantity(String(data.total_quantity || '100'));
        setMaxPerBooking(String(data.max_per_booking || '10'));
        setStatus(data.status || 'active');
      } catch (err: any) {
        setError(err.message || 'Failed to load details');
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/ticket_types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price) || 0,
          currency,
          total_quantity: parseInt(totalQuantity) || 0,
          max_per_booking: parseInt(maxPerBooking) || 10,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update ticket tier');
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Ticket Tier Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Early Bird, VIP Access"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Description</label>
        <textarea
          placeholder="Details about privileges included with this tier..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Currency</label>
          <input
            type="text"
            required
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Total Quantity</label>
          <input
            type="number"
            required
            min="1"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Max Per Booking</label>
          <input
            type="number"
            required
            min="1"
            value={maxPerBooking}
            onChange={(e) => setMaxPerBooking(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Update Ticket Type
      </button>
    </form>
  );
}
