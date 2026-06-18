import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBooking, getEvent, getTicketType } from '@/lib/firestore/app-data';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  Calendar, 
  Tag, 
  User, 
  Mail, 
  Phone,
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  FileText,
  Bookmark
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage(props: PageProps) {
  const { id } = await props.params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  // Fetch Event and Ticket Type metadata
  const [event, ticketType] = await Promise.all([
    getEvent(booking.event_id),
    getTicketType(booking.ticket_type_id),
  ]);

  const formatDate = (val: any) => {
    if (!val) return 'N/A';
    const date = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    return date.toLocaleString('en-US', {
      weekday: 'short',
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-4 w-4" />
            Pending
          </span>
        );
      case 'cancelled':
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-4 w-4" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700 border border-slate-200">
            <AlertCircle className="h-4 w-4" />
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-105 px-3 py-0.5 text-xs font-semibold text-yellow-800">
            Payment Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-850">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
            {status || 'Unpaid'}
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button and Edit action toolbar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Bookings List
        </Link>

        <div className="flex gap-2">
          <Link
            href={`/bookings/${id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Pencil className="h-4 w-4 text-slate-500" />
            Modify Booking
          </Link>
        </div>
      </div>

      {/* Detail Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Booking Overview Information Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block font-mono">
                  REF: {booking.booking_reference}
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                  {booking.customer_name}
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  Issued on {formatDate(booking.booked_at)}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 items-start sm:items-end">
                {getStatusBadge(booking.status)}
                <div className="mt-1">{getPaymentBadge(booking.payment_status)}</div>
              </div>
            </div>

            {/* Event and Ticket reference section */}
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Event Registration</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Target Event</span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {event?.name || <span className="italic text-slate-400">Loading parent event...</span>}
                    </span>
                    {event && (
                      <span className="text-xs text-slate-500 block mt-1">
                        Starts {formatDate(event.start_datetime)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Tag className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Selected Ticket Category</span>
                    <span className="text-sm font-bold text-indigo-600 block mt-0.5">
                      {ticketType?.name || <span className="italic text-slate-400">Loading ticket definition...</span>}
                    </span>
                    {ticketType && (
                      <span className="text-xs text-slate-500 block mt-1">
                        Price: {ticketType.price} {ticketType.currency} per spot
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Core checkout financials */}
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Finance Details</h2>
              <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                <div className="p-3">
                  <span className="text-xs text-slate-400 font-semibold block">Ordered Spot Qty</span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block">{booking.quantity}</span>
                </div>
                <div className="p-3">
                  <span className="text-xs text-slate-400 font-semibold block">Declared Cost Code</span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block uppercase">{booking.currency || 'USD'}</span>
                </div>
                <div className="p-3 bg-indigo-50/20 rounded-xl border border-indigo-50">
                  <span className="text-xs text-indigo-500 font-semibold block">Total Aggregated Cost</span>
                  <span className="text-xl font-bold text-slate-950 mt-1 block">
                    {booking.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional guest memo check info */}
            <div className="pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Guest Instructions / Staff Memo</h3>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100 italic min-h-[64px]">
                {booking.notes || 'No custom notes or dietary tags provided with this transaction booking.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Cards and Live Checked-in Monitor */}
        <div className="space-y-6">
          {/* Guest Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-slate-400" />
              Customer Details
            </h3>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">{booking.customer_name}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5 hover:underline">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${booking.customer_email}`}>{booking.customer_email}</a>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contact Phone</span>
                <span className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {booking.customer_phone || 'None entered'}
                </span>
              </div>
            </div>
          </div>

          {/* Secure validation & check-in parameters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Bookmark className="h-4.5 w-4.5 text-slate-400" />
              Gate Entrance Status
            </h3>

            <div className="text-center py-4 bg-slate-50/70 rounded-xl border border-slate-100">
              {booking.checked_in_at ? (
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-850 mt-2 block">Checked In</span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Validated entry gate:
                  </p>
                  <p className="text-xs font-medium text-slate-600 font-mono mt-0.5">
                    {formatDate(booking.checked_in_at)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-slate-200 p-2 text-slate-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-500 mt-2 block">Not Checked In</span>
                  <p className="text-[10px] text-slate-400 max-w-[180px] mt-1 mx-auto">
                    The customer has not validated this ticket reference code at venue gateway yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
