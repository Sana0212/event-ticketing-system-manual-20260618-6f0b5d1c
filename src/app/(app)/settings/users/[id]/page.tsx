'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Shield, User } from 'lucide-react';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-slate-700">
      <Link href="/settings/users" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Users List
      </Link>

      <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className="uppercase text-xs font-semibold">{user.role_key}</span>
              </p>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {user.status || 'Active'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Contact Information</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-slate-900">{user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">System Metadata</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-555">Created:</span>
                <span className="font-semibold text-slate-900">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Initial Setup'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-555">Last Update:</span>
                <span className="font-semibold text-slate-900">
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Link
            href={`/settings/users/${user.id}/edit`}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Edit User Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
