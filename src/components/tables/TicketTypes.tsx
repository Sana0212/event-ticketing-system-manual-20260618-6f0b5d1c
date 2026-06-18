'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface TicketTypesTableProps {
  data: any[];
  events: any[];
  onDeleteSuccess: () => void;
}

export default function TicketTypesTable({ data, events, onDeleteSuccess }: TicketTypesTableProps) {
  const { user } = useSession();

  const getEventName = (id: string) => {
    const found = events.find((e) => e.id === id);
    return found ? found.name : 'Unknown Event';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket type?')) return;
    try {
      const res = await fetch(`/api/ticket_types/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteSuccess();
      } else {
        alert('Failed to delete ticket type.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'event_organizer';
  const canDelete = user?.role === 'admin';

  return (
    <div className="overflow-x-auto text-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 uppercase tracking-wider text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-3.5 text-left">Name</th>
            <th className="px-6 py-3.5 text-left">Event</th>
            <th className="px-6 py-3.5 text-left">Price</th>
            <th className="px-6 py-3.5 text-left">Capacity</th>
            <th className="px-6 py-3.5 text-left">Status</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No ticket types configured yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4">{getEventName(item.event_id)}</td>
                <td className="px-6 py-4">
                  {item.price} {item.currency || 'USD'}
                </td>
                <td className="px-6 py-4">{item.total_quantity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-150 text-green-800'
                        : 'bg-slate-150 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/tickets/${item.id}`}
                      className="p-1 text-slate-500 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {canEdit && (
                      <Link
                        href={`/tickets/${item.id}/edit`}
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
