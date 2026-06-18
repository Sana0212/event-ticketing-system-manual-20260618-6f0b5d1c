'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface UserEditFormProps {
  id: string;
  onSuccess: () => void;
}

export default function UserEditForm({ id, onSuccess }: UserEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleKey, setRoleKey] = useState('staff');
  const [status, setStatus] = useState('active');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('Failed to load user details');
        const json = await res.json();
        const data = json.data || {};
        setEmail(data.email || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
        setRoleKey(data.role_key || 'staff');
        setStatus(data.status || 'active');
      } catch (err: any) {
        setError(err.message || 'Error occurred during fetch');
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
      const payload: any = {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role_key: roleKey,
        status,
      };

      if (password) {
        payload.password_hash = password;
      }

      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update user profile');
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
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-700 font-sans">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-100">
          {error}
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
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">New Password (optional)</label>
        <input
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Contact Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Permissions Role</label>
          <select
            value={roleKey}
            onChange={(e) => setRoleKey(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none bg-white font-medium"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none bg-white font-medium"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Update User Profile
      </button>
    </form>
  );
}
