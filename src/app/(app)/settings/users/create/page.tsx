'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UserCreateForm from '@/components/forms/UserCreateForm';

export default function CreateUserPage() {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-slate-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Application User</h1>
        <p className="text-sm text-slate-500">Provide personal credentials and select a permissions group.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <UserCreateForm onSuccess={() => router.push('/settings/users')} />
      </div>
    </div>
  );
}
