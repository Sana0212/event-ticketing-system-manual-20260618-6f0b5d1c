'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface OrganizationSettingsFormProps {
  onSuccess: () => void;
}

export default function OrganizationSettingsForm({ onSuccess }: OrganizationSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to register or update setting key.');
      }

      setKey('');
      setValue('');
      setDescription('');
      setSuccess('Parameter set updated successfully.');
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-xs text-green-700 border border-green-100">
          {success}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Setting Key Name</label>
        <input
          type="text"
          required
          placeholder="e.g. currency_default, stripe_public"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Value</label>
        <input
          type="text"
          required
          placeholder="e.g. USD, pk_test_xxxx"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Short Description</label>
        <textarea
          placeholder="What is this configuration sequence utilized for..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Register Key Config
      </button>
    </form>
  );
}
