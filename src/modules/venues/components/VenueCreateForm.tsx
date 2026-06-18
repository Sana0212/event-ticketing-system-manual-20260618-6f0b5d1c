'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface VenueCreateFormProps {
  onSuccess?: () => void;
}

export default function VenueCreateForm({ onSuccess }: VenueCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 100,
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'Active',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to create venue');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/venues');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            General Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Venue Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Grand Ballroom, Area 3..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="capacity" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                placeholder="500"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label htmlFor="location" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Location/Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Conference Way, New York..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label htmlFor="description" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Add optional notes, accessibility info, or seating details..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="status" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Contact Person Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label htmlFor="contact_name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Name
              </label>
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact_email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Email
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact_phone" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="text"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/venues"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:bg-indigo-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Venue'
          )}
        </button>
      </div>
    </form>
  );
}
