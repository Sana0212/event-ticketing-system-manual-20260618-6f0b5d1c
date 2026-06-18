'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserEditForm from '@/components/forms/UserEditForm';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setUserId(p.id));
  }, [params]);

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-slate-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit User Profile</h1>
        <p className="text-sm text-slate-500">Modify basic identity properties or status variables.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <UserEditForm id={userId} onSuccess={() => router.push('/settings/users')} />
      </div>
    </div>
  );
}
