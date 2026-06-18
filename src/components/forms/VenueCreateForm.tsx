'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface VenueCreateFormProps {
  onSuccess: () => void;
}

export default function VenueCreateForm({ onSuccess }: VenueCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('500');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState('active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          capacity: parseInt(capacity) || 0,
          description,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create venue location');
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-700 font-sans">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Venue Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Grand Ballroom, West Hall"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Physical Location</label>
        <input
          type="text"
          required
          placeholder="e.g. Level B, 128 Business Way"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Maximum Capacity</label>
          <input
            type="number"
            required
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Description</label>
        <textarea
          placeholder="Details about size, sound systems, styling configs..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none min-h-[80px]"
        />
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-4">
        <h4 className="text-sm font-bold text-slate-800">Point of Contact Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Manager Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Email</label>
            <input
              type="email"
              placeholder="manager@domain.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Phone</label>
            <input
              type="tel"
              placeholder="+1..."
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Venue
      </button>
    </form>
  );
}
