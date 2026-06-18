'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import UsersTable from '@/components/tables/Users';

export default function UsersPage() {
  const [trigger, setTrigger] = useState(0);

  const handleRefresh = () => {
    setTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">Provide platform access, define roles and monitor active operators.</p>
        </div>
        <div>
          <Link
            href="/settings/users/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
        <UsersTable key={trigger} onRefresh={handleRefresh} />
      </div>
    </div>
  );
}
