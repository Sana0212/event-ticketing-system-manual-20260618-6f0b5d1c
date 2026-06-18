'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import OrganizationSettingsForm from '@/components/forms/OrganizationSettingsForm';
import SettingsTable from '@/components/tables/Settings';

export default function OrganizationSettingsPage() {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 text-slate-700">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Settings</h1>
        <p className="text-sm text-slate-500">Configure global parameters and options for the event platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add or Update Setting</h2>
            <OrganizationSettingsForm onSuccess={handleRefresh} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Global Registry</h2>
              <p className="text-xs text-slate-500">Current active keys utilized by booking pipelines.</p>
            </div>
            <SettingsTable key={key} onRefresh={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
}
