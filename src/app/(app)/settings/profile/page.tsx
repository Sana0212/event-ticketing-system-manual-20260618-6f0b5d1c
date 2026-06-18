'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ProfileSettingsForm from '@/components/forms/ProfileSettingsForm';

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-slate-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-500">Update your account name and phone number.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <ProfileSettingsForm />
      </div>
    </div>
  );
}
