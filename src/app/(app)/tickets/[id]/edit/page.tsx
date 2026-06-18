'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TicketTypeEditForm from '@/components/forms/TicketTypeEditForm';

export default function EditTicketTypePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setTicketId(p.id));
  }, [params]);

  if (!ticketId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Ticket Type</h1>
        <p className="text-sm text-slate-500">Configure parameters for this pricing tier.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <TicketTypeEditForm id={ticketId} onSuccess={() => router.push('/tickets')} />
      </div>
    </div>
  );
}
