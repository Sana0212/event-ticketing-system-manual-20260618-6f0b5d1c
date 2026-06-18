'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Loader2 } from 'lucide-react';

export default function ProfileSettingsForm() {
  const { user, refreshSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function load() {
      if (!user?.userId) return;
      try {
        const res = await fetch(`/api/users/${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPhone(data.phone || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          role_key: user.role, // Do not change role or status via profile
          status: 'active',
          email: user.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not update identity settings.');
      }

      await refreshSession();
      setSuccess('Your profile options have been recorded successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error updating settings');
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">First Name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Last Name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Contact Phone</label>
        <input
          type="tel"
          placeholder="+1 (555) 019-2834"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Parameters
      </button>
    </form>
  );
}
