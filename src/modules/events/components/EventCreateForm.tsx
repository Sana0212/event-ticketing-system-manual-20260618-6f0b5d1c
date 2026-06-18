'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Calendar, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import type { VenueRecord } from '@/data/types';

interface EventCreateFormProps {
  venues: VenueRecord[];
}

export default function EventCreateForm({ venues }: EventCreateFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [venueId, setVenueId] = useState('');
  const [status, setStatus] = useState('draft');
  const [capacity, setCapacity] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [bookingDeadline, setBookingDeadline] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Minor validation
    if (!name.trim()) {
      setError('Event Name is required');
      setLoading(false);
      return;
    }
    if (!startDatetime) {
      setError('Start date & time is required');
      setLoading(false);
      return;
    }
    if (!endDatetime) {
      setError('End date & time is required');
      setLoading(false);
      return;
    }
    if (!venueId) {
      setError('Please select a venue');
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, any> = {
        name,
        description: description || undefined,
        category: category || undefined,
        start_datetime: new Date(startDatetime).toISOString(),
        end_datetime: new Date(endDatetime).toISOString(),
        venue_id: venueId,
        status,
        timezone: timezone || undefined,
      };

      if (capacity) {
        payload.capacity = Number(capacity);
      }
      if (bookingDeadline) {
        payload.booking_deadline = new Date(bookingDeadline).toISOString();
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to create event');
      }

      router.push('/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb / Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/events" className="hover:text-slate-800">Events</Link>
          <span>/</span>
          <span className="font-medium text-slate-800">Create Event</span>
        </div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">Configure New Event</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define schedule, assign venue, and configure booking restrictions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
              {error}
            </div>
          )}

          {/* Primary details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Annual Tech Symposium & Awards Gala"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about schedules, main keynotes, and travel logistics..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Conference, Hospitality, Concert"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Venue <span className="text-rose-500">*</span>
              </label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">-- Select Event Venue --</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.location}) — Cap: {v.capacity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Schedule */}
          <div>
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Event Schedule & Timezone
            </h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Start Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  End Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={endDatetime}
                  onChange={(e) => setEndDatetime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. UTC, America/New_York, EST"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Booking Deadline
                </label>
                <input
                  type="datetime-local"
                  value={bookingDeadline}
                  onChange={(e) => setBookingDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Allocation & Logistics */}
          <div>
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Inventory & Status
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Event Max Capacity (Total Attendees)
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 500 (Defaults to venue max if empty)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="draft">Draft (Invisible to Customers)</option>
                  <option value="published">Published (Accepting Bookings)</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              href="/events"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Creating event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
