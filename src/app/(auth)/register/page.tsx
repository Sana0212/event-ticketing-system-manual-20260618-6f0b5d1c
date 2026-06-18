'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { CalendarDays, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { refreshSession } = useSession();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleKey, setRoleKey] = useState('event_organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Body matches requireAuth schema rules and register expectation:
      // Register body: { email, password, full_name, role_key } or similar template auth maps.
      // Let's build full_name safely in addition to first/last name to make sure.
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role_key: roleKey,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Registration failed. Please check network or fields.');
      }

      await refreshSession();
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel with features (visible on md+) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-indigo-900 p-12 text-white md:flex">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(99,102,241,0.2),rgba(168,85,247,0.1))] bg-cover" />
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <CalendarDays className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">MonstarX Portal</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                Hospitality & Conferences
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Join Next-Generation Event Logistics
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight">
            Register your operator profile to build seamless booking solutions.
          </h1>
          <p className="mt-4 text-base text-indigo-200 leading-relaxed font-light">
            Gain immediate access to premium venue inventory, real-time customer status monitors, automated ticket confirmations, and live payment settlements.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 mt-0.5 items-center justify-center rounded-full bg-indigo-500/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" />
              </div>
              <p className="text-sm font-medium text-indigo-100">
                Choose custom granular workspace roles with strict access controls
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 mt-0.5 items-center justify-center rounded-full bg-indigo-500/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-300" />
              </div>
              <p className="text-sm font-medium text-indigo-100">
                Collaborate directly with Venue Managers & Hospitality coordinators
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-300">
          &copy; {new Date().getFullYear()} MonstarX. Built for optimal hospitality and booking workflows.
        </div>
      </div>

      {/* Form Card Layout */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-16 xl:px-24 bg-slate-50">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Brand View */}
          <div className="mb-10 md:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                <CalendarDays className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight block">MonstarX Portal</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">
                  Event & Hospitality Systems
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create workspace account</h2>
            <p className="mt-2.5 text-sm text-slate-600 font-light">
              Enter details below to establish your MonstarX operator credentials.
            </p>
          </div>

          <div className="mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-100 animate-fadeIn">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{error}</span>
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
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="Jane"
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
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="name@organization.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="••••••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Workplace Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={roleKey}
                      onChange={(e) => setRoleKey(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="event_organizer">Event Organizer</option>
                      <option value="venue_manager">Venue Manager</option>
                      <option value="support">Support Staff</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:shadow-none disabled:active:scale-100 cursor-pointer"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm font-light text-slate-600">
                  Already have an operator account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
