'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface BookingsTableProps {
  data: any[];
  events: any[];
  ticketTypes: any[];
  onDeleteSuccess: () => void;
}

export default function BookingsTable({ data, events, ticketTypes, onDeleteSuccess }: BookingsTableProps) {
  const { user } = useSession();

  const getEventName = (id: string) => {
    const found = events.find((e) => e.id === id);
    return found ? found.name : 'Unknown Event';
  };

  const getTicketName = (id: string) => {
    const found = ticketTypes.find((t) => t.id === id);
    return found ? found.name : 'Unknown Ticket';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteSuccess();
      } else {
        alert('Failed to delete booking.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = true; // admin, event_organizer, venue_manager, support
  const canDelete = user?.role === 'admin';

  return (
    <div className="overflow-x-auto text-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 uppercase tracking-wider text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-3.5 text-left">Reference</th>
            <th className="px-6 py-3.5 text-left">Event</th>
            <th className="px-6 py-3.5 text-left">Customer</th>
            <th className="px-6 py-3.5 text-left">Qty</th>
            <th className="px-6 py-3.5 text-left">Total</th>
            <th className="px-6 py-3.5 text-left">Status</th>
            <th className="px-6 py-3.5 text-left">Payment</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                No bookings registered yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-slate-900">{item.booking_reference}</td>
                <td className="px-6 py-4">
                  <div>{getEventName(item.event_id)}</div>
                  <div className="text-xs text-slate-400">{getTicketName(item.ticket_type_id)}</div>
                </td>
                <td className="px-6 py-4 text-slate-900">
                  <div className="font-medium">{item.customer_name}</div>
                  <div className="text-xs text-slate-500">{item.customer_email}</div>
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">
                  {item.total_amount} {item.currency || 'USD'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-105 text-yellow-850'
                    }`}
                  >
                    {item.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/bookings/${item.id}`}
                      className="p-1 text-slate-500 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {canEdit && (
                      <Link
                        href={`/bookings/${item.id}/edit`}
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
