'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Search, 
  Building2, 
  Users, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import type { VenueRecord } from '@/data/types';

interface VenuesTableProps {
  venues: VenueRecord[];
}

export default function VenuesTable({ venues: initialVenues }: VenuesTableProps) {
  const router = useRouter();
  const [venues, setVenues] = useState<VenueRecord[]>(initialVenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter & Search logic
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchSearch = 
        venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || venue.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [venues, searchTerm, selectedStatus]);

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete venue "${name}"? This action cannot be undone.`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete venue');
      }
      setVenues((prev) => prev.filter((v) => v.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error occurred during deletion');
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <AlertCircle className="h-3 w-3" />
            {status || 'Maintenance'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-3">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by venue name, location, contact, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Table Display */}
      {filteredVenues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center">
          <Building2 className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900">No venues found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm || selectedStatus !== 'ALL'
              ? 'Try modifying your search query or filters.'
              : 'Get started by creating your first venue.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Venue Details</th>
                  <th scope="col" className="px-6 py-4">Location</th>
                  <th scope="col" className="px-6 py-4 text-center">Capacity</th>
                  <th scope="col" className="px-6 py-4">Primary Contact</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-12 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 bg-white">
                {filteredVenues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Desc */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">
                          {venue.name}
                        </span>
                        {venue.description && (
                          <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {venue.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate max-w-xs">{venue.location}</span>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs">
                        <Users className="h-3.5 w-3.5 text-slate-500" />
                        {venue.capacity.toLocaleString()}
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-6 py-4">
                      {venue.contact_name ? (
                        <div className="flex flex-col text-xs text-slate-500 space-y-0.5">
                          <span className="font-semibold text-slate-700">{venue.contact_name}</span>
                          {venue.contact_email && (
                            <span className="text-slate-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {venue.contact_email}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">{getStatusBadge(venue.status)}</td>

                    {/* Action buttons */}
                    <td className="px-12 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/venues/${venue.id}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/venues/${venue.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          disabled={isDeleting === venue.id}
                          onClick={() => handleDelete(venue.id, venue.name)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
