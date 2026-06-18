'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface SettingsTableProps {
  onRefresh?: () => void;
}

export default function SettingsTable({ onRefresh }: SettingsTableProps) {
  const { user } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;
    try {
      const res = await fetch(`/api/settings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadSettings();
        if (onRefresh) onRefresh();
      } else {
        alert('Failed to delete setting.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 uppercase tracking-wider text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-3.5 text-left">Key</th>
            <th className="px-6 py-3.5 text-left">Value</th>
            <th className="px-6 py-3.5 text-left">Description</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                No organization settings configured yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id || item.key} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-semibold text-slate-900">{item.key}</td>
                <td className="px-6 py-4 truncate max-w-xs font-medium text-slate-800">{item.value}</td>
                <td className="px-6 py-4 text-slate-500">{item.description || 'No description'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item.id || item.key)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete setting"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
