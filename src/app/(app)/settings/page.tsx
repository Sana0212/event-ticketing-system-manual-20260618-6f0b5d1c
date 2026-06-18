'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import {
  User,
  Building,
  Users,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Pencil
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface GlobalSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

interface WorkspaceUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_key: string;
  status: string;
}

export default function SettingsPage() {
  const { user, refreshSession } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'users'>('profile');

  // Form states - Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Form states - Org Settings
  const [settings, setSettings] = useState<GlobalSetting[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [orgSuccess, setOrgSuccess] = useState(false);

  // Form states - User Admin List
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Load profile values on session change
  useEffect(() => {
    if (user) {
      const names = user.fullName.split(' ');
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
    }
  }, [user]);

  // Handle Tab Navigation and Data Fetching
  useEffect(() => {
    if (activeTab === 'organization' && user?.role === 'admin') {
      fetchSettings();
    } else if (activeTab === 'users' && user?.role === 'admin') {
      fetchUsers();
    }
  }, [activeTab, user]);

  const fetchSettings = async () => {
    setOrgLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || []);
      }
    } catch (err) {
      setOrgError('Failed to fetch organization settings.');
    } finally {
      setOrgLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to resolve users list', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      // Direct update profile endpoint or user put
      const res = await fetch(`/api/users/${user?.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          email: user?.email,
          role_key: user?.role,
          status: 'active'
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to update workspace profile fields.');
      }

      await refreshSession();
      setProfileSuccess(true);
    } catch (err: any) {
      setProfileError(err?.message || 'Error occurred updating details.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Safe tab selection filters
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8 pb-12">
      {/* Settings Headline */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">System Configuration</h1>
        <p className="mt-1.5 text-sm text-slate-500 font-light">
          Manage workspace profile data, fine-tune system rules, or govern overall collaborator roles.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`group flex items-center gap-2 border-b-2 py-4 px-4.5 text-sm font-semibold transition ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <User className="h-4 w-4" />
          Profile Settings
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('organization')}
              className={`group flex items-center gap-2 border-b-2 py-4 px-4.5 text-sm font-semibold transition ${
                activeTab === 'organization'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Building className="h-4 w-4" />
              Organization Settings
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`group flex items-center gap-2 border-b-2 py-4 px-4.5 text-sm font-semibold transition ${
                activeTab === 'users'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Users className="h-4 w-4" />
              User management
            </button>
          </>
        )}
      </div>

      {/* Tab Context Frame */}
      <div className="max-w-2xl">
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Details</h2>
            <p className="text-xs text-slate-400 mb-6 font-light">
              This setup represents your user record shown inside logs and generated tickets.
            </p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileError && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="flex items-center px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm">
                  {user?.email}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 font-light">Email addresses are locked to authenticate matching profiles.</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-150 transition cursor-pointer disabled:opacity-50"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'organization' && isAdmin && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Organization & Hospitality Rules</h2>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Configure system parameters globally. Parameters impact check-ins, ticketing deadlines, and global currencies.
            </p>

            {orgLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : settings.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm font-light">
                No custom global parameters defined yet in this collection.
              </div>
            ) : (
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{setting.key}</span>
                      <span className="text-[11px] text-slate-400">ID: {setting.id}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{setting.value}</p>
                    <p className="text-xs text-slate-500 font-light mt-1.5">{setting.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Workspace Collaborators</h2>
                <p className="text-xs text-slate-400 font-light">Governing credentials granted and permissions tier.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {usersLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : users.length === 0 ? (
                <p className="py-8 text-center text-slate-400 text-sm">No administrators or organizers mapped in the system.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {users.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50/40">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.first_name} {item.last_name}
                        </p>
                        <p className="text-xs text-slate-400 font-light">{item.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                          {item.role_key.replace('_', ' ')}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
