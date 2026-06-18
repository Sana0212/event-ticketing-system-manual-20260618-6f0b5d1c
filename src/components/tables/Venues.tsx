'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface VenuesTableProps {
  data: any[];
  onDeleteSuccess: () => void;
}

export default function VenuesTable({ data, onDeleteSuccess }: VenuesTableProps) {
  const { user } = useSession();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    try {
      const res = await fetch(`/api/venues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteSuccess();
      } else {
        alert('Failed to delete venue.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'venue_manager';
  const canDelete = user?.role === 'admin';

  return (
    <div className="overflow-x-auto text-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 uppercase tracking-wider text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-3.5 text-left">Venue Name</th>
            <th className="px-6 py-3.5 text-left">Location</th>
            <th className="px-6 py-3.5 text-left">Capacity</th>
            <th className="px-6 py-3.5 text-left">Contact Name</th>
            <th className="px-6 py-3.5 text-left">Contact Email</th>
            <th className="px-6 py-3.5 text-left">Status</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                No venues configured yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4">{item.location}</td>
                <td className="px-6 py-4">{item.capacity}</td>
                <td className="px-6 py-4">{item.contact_name || 'N/A'}</td>
                <td className="px-6 py-4">{item.contact_email || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/venues/${item.id}`}
                      className="p-1 text-slate-500 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {canEdit && (
                      <Link
                        href={`/venues/${item.id}/edit`}
                        className="p-1 text-slate-500 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
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
