'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  Pencil, 
  Trash2, 
  Eye, 
  Search, 
  SlidersHorizontal,
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import type { EventRecord, VenueRecord, UserRecord } from '@/data/types';

interface EventsTableProps {
  events: EventRecord[];
  venues: VenueRecord[];
  users: UserRecord[];
  currentUserRole?: string;
}

export default function EventsTable({ events: initialEvents, venues, users, currentUserRole }: EventsTableProps) {
  const router = useRouter();
  const [events, setEvents] = useState<EventRecord[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedVenue, setSelectedVenue] = useState<string>('ALL');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const venueMap = useMemo(() => {
    return new Map(venues.map(v => [v.id, v]));
  }, [venues]);

  const userMap = useMemo(() => {
    return new Map(users.map(u => [u.id, `${u.first_name} ${u.last_name}`]));
  }, [users]);

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete event "${name}"? This action is irreversible.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete event');
      }
      setEvents(prev => prev.filter(e => e.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error occurred during deletion');
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter criteria
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchSearch = 
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === 'ALL' || event.status === selectedStatus;
      const matchVenue = selectedVenue === 'ALL' || event.venue_id === selectedVenue;

      return matchSearch && matchStatus && matchVenue;
    });
  }, [events, searchTerm, selectedStatus, selectedVenue]);

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
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            Draft
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <AlertCircle className="h-3.5 w-3.5" />
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Publishing Statuses</option>
              <option value="draft">Draft Only</option>
              <option value="published">Published Only</option>
              <option value="cancelled">Cancelled Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>

          {/* Venue Dropdown */}
          <div className="relative">
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Venues</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.location})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid count summary */}
      <div className="text-right text-xs font-semibold text-slate-500 pr-2">
        Showing {filteredEvents.length} of {events.length} listed events
      </div>

      {/* Core Table List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th className="px-6 py-4 font-bold">Event Details</th>
                <th className="px-6 py-4 font-bold">Venue Assignment</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Start Schedule</th>
                <th className="px-6 py-4 font-bold">Cap. Limit</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-semibold text-slate-500">No events found matching current criteria</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or search keywords above.</p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const venueObj = venueMap.get(event.venue_id);
                  const organizerName = userMap.get(event.organizer_id) || 'Unknown Organizer';
                  return (
                    <tr key={event.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-col gap-1">
                          <Link 
                            href={`/events/${event.id}`}
                            className="font-semibold text-slate-950 hover:text-indigo-600 transition-colors hover:underline"
                          >
                            {event.name}
                          </Link>
                          {event.description && (
                            <span className="line-clamp-1 text-xs text-slate-400">
                              {event.description}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                            ID: {event.id.slice(0, 8)}... • Org: {organizerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {venueObj ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{venueObj.name}</span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <MapPin className="h-3 w-3 inline-shrink-0" />
                              {venueObj.location}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Venue Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {event.category || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-slate-950 whitespace-nowrap">
                          <span className="font-semibold">{formatDate(event.start_datetime)}</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">{event.timezone || 'America/New_York'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-900 font-semibold">
                        {event.capacity || (venueObj ? venueObj.capacity : '∞')}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/events/${event.id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="View Event Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          
                          {/* Event Organizer or Admin can edit */}
                          <Link
                            href={`/events/${event.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                            title="Edit Event Configuration"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {/* Only Admin can delete */}
                          {currentUserRole === 'admin' && (
                            <button
                              onClick={() => handleDelete(event.id, event.name)}
                              disabled={isDeleting === event.id}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                              title="Delete Event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
