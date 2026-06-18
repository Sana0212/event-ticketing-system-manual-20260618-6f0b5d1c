'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import {
  Calendar,
  Building2,
  Tag,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Ticket,
  ChevronRight,
  Plus,
  Loader2,
  CalendarDays
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DashboardStats {
  upcomingEventsCount: number;
  ticketsSoldToday: number;
  revenueThisWeek: number;
  activeVenuesCount: number;
}

interface RecentEvent {
  id: string;
  name: string;
  start_datetime: string;
  category: string;
  status: string;
}

interface RecentBooking {
  id: string;
  booking_reference: string;
  customer_name: string;
  total_amount: number;
  currency: string;
  quantity: number;
  status: string;
}

export default function DashboardPage() {
  const { user } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEventsCount: 0,
    ticketsSoldToday: 0,
    revenueThisWeek: 0,
    activeVenuesCount: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.recentEvents) setRecentEvents(data.recentEvents);
          if (data.recentBookings) setRecentBookings(data.recentBookings);
        }
      } catch (err) {
        console.error('Error fetching dashboard widgets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Retrieving hospitality metric widgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        <p className="mt-1.5 text-sm text-slate-500 font-light">
          Real-time metrics, upcoming conferences, hospitality capacity, and ticketer listings.
        </p>
      </div>

      {/* Aggregate Widgets Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Widget 1: Upcoming Events count */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-indigo-50/50" />
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <span className="block mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Upcoming Events
            </span>
            <span className="block mt-1 text-3xl font-extrabold text-slate-900">
              {stats.upcomingEventsCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">Scheduled & active statuses</p>
        </div>

        {/* Widget 2: Tickets components */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-50/50" />
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Ticket className="h-5.5 w-5.5" />
            </div>
            <span className="block mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tickets Sold Today
            </span>
            <span className="block mt-1 text-3xl font-extrabold text-slate-900">
              {stats.ticketsSoldToday}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">Refreshed minutes ago</p>
        </div>

        {/* Widget 3: Weekly profit */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-purple-50/50" />
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
            <span className="block mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Revenue This Week
            </span>
            <span className="block mt-1 text-3xl font-extrabold text-slate-900">
              {formatCurrency(stats.revenueThisWeek)}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">From validated booking payments</p>
        </div>

        {/* Widget 4: Active venues */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-amber-50/50" />
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Building2 className="h-5.5 w-5.5" />
            </div>
            <span className="block mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Venues
            </span>
            <span className="block mt-1 text-3xl font-extrabold text-slate-900">
              {stats.activeVenuesCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">With configured seat designs</p>
        </div>
      </div>

      {/* Main content grid split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Recent Events */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live & Scheduled Events</h2>
              <p className="text-xs text-slate-400">Events with current ticket allocations.</p>
            </div>
            {['admin', 'event_organizer'].includes(user?.role || '') && (
              <Link
                href="/events/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:indigo-700 transition"
              >
                <Plus className="h-3.5 w-3.5" /> New Event
              </Link>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {recentEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <CalendarDays className="h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">No events found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-[240px]">
                  Build your first live event or venue alignment to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4.5 hover:bg-slate-50/55 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-semibold text-slate-800 truncate">{event.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {event.category || 'Concert'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(event.start_datetime).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          event.status === 'published' || event.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {event.status}
                      </span>
                      <Link
                        href={`/events/${event.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recent Bookings */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Guest Bookings</h2>
            <p className="text-xs text-slate-400">Overview of recent tickets purchased.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <ClipboardList className="h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">No bookings available</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-[220px]">
                  Customer bookings will appear here once dynamic ticket lines sell.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest leading-none">
                        #{booking.booking_reference}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {formatCurrency(booking.total_amount, booking.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-semibold text-slate-800 truncate">{booking.customer_name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{booking.quantity} Ticket(s)</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : booking.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
