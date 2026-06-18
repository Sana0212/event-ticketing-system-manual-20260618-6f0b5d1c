'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Search, 
  SlidersHorizontal,
  Calendar,
  DollarSign,
  User,
  Ticket,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import type { BookingRecord, EventRecord, TicketTypeRecord } from '@/data/types';

interface BookingsTableProps {
  bookings: BookingRecord[];
  events: EventRecord[];
  ticketTypes: TicketTypeRecord[];
}

export default function BookingsTable({ bookings: initialBookings, events, ticketTypes }: BookingsTableProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof BookingRecord>('booked_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Mappers for ID to Name
  const eventMap = useMemo(() => {
    return new Map(events.map(e => [e.id, e.name]));
  }, [events]);

  const ticketTypeMap = useMemo(() => {
    return new Map(ticketTypes.map(t => [t.id, t.name]));
  }, [ticketTypes]);

  // Handle delete operation
  const handleDelete = async (id: string, refCode: string) => {
    if (!confirm(`Are you sure you want to delete booking ${refCode}?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete booking');
      }
      setBookings(prev => prev.filter(b => b.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error occurred during deletion');
    } finally {
      setIsDeleting(null);
    }
  };

  // Sorting logic
  const handleSort = (field: keyof BookingRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter & Search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search matches reference, customer name, customer email, or customer phone
      const matchSearch = 
        booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || booking.status === selectedStatus;
      const matchPaymentStatus = selectedPaymentStatus === 'ALL' || booking.payment_status === selectedPaymentStatus;
      const matchEvent = selectedEventId === 'ALL' || booking.event_id === selectedEventId;

      return matchSearch && matchStatus && matchPaymentStatus && matchEvent;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle null/undefined or object/Timestamp values for sorting
      if (sortField === 'booked_at' || sortField === 'created_at') {
        const getMs = (val: any) => {
          if (!val) return 0;
          if (val.seconds) return val.seconds * 1000;
          return new Date(val).getTime();
        };
        aVal = getMs(aVal);
        bVal = getMs(bVal);
      }

      const comparison = String(aVal || '').localeCompare(String(bVal || ''), undefined, { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [bookings, searchTerm, selectedStatus, selectedPaymentStatus, selectedEventId, sortField, sortDirection]);

  // Unique lists for filters
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.status).filter(Boolean)));
  }, [bookings]);

  const uniquePaymentStatuses = useMemo(() => {
    return Array.from(new Set(bookings.map(b => b.payment_status).filter(Boolean)));
  }, [bookings]);

  const formatDate = (val: any) => {
    if (!val) return 'N/A';
    const date = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'cancelled':
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <AlertCircle className="h-3 w-3" />
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Payment Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {status || 'Unpaid'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by reference, customer name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Event Filter */}
          <div>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>

          {/* Booking Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Bookings Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Payments</option>
              {uniquePaymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4">
                  <button onClick={() => handleSort('booking_reference')} className="flex items-center gap-1 hover:text-slate-950 font-bold">
                    Ref Code
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Event & Ticket</th>
                <th scope="col" className="px-6 py-4 text-center">
                  <button onClick={() => handleSort('quantity')} className="inline-flex items-center gap-1 hover:text-slate-950 font-bold">
                    Qty
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4">
                  <button onClick={() => handleSort('total_amount')} className="flex items-center gap-1 hover:text-slate-950 font-bold">
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Payment</th>
                <th scope="col" className="px-6 py-4">
                  <button onClick={() => handleSort('booked_at')} className="flex items-center gap-1 hover:text-slate-950 font-bold">
                    Booked At
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <SlidersHorizontal className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-500">No bookings found</p>
                      <p className="text-xs">Try adjusting your filters or booking custom parameters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4.5 font-mono text-xs font-semibold text-indigo-700">
                      <Link href={`/bookings/${booking.id}`} className="hover:underline">
                        {booking.booking_reference || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="font-medium text-slate-900">{booking.customer_name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[180px]">{booking.customer_email}</div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="font-medium text-slate-900 max-w-[200px] truncate">
                        {eventMap.get(booking.event_id) || <span className="text-slate-400 text-xs italic">Unknown Event</span>}
                      </div>
                      <div className="text-xs text-indigo-600 font-medium">
                        {ticketTypeMap.get(booking.ticket_type_id) || <span className="text-slate-400 text-xs italic">Unknown Ticket</span>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5 text-center font-semibold text-slate-900">
                      {booking.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5 font-bold text-slate-900">
                      {booking.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] font-normal text-slate-500 uppercase">{booking.currency || 'USD'}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5">
                      {getPaymentBadge(booking.payment_status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5 text-xs text-slate-500">
                      {formatDate(booking.booked_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4.5 text-right text-xs font-medium">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/bookings/${booking.id}/edit`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50 transition-colors"
                          title="Edit Booking"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(booking.id, booking.booking_reference)}
                          disabled={isDeleting === booking.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table footer count */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 text-xs text-slate-500">
          <div>
            Showing <strong className="font-semibold text-slate-900">{filteredBookings.length}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{bookings.length}</strong> bookings
          </div>
        </div>
      </div>
    </div>
  );
}
