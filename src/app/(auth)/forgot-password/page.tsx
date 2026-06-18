'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, CalendarDays, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Confirmation password does not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to update credentials. Please check that the account exists.');
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Server error occurred during credential reset.');
    } finally {
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
            Reliable Recovery Systems
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight">
            Seamless credential recovery for active personnel.
          </h1>
          <p className="mt-4 text-base text-indigo-200 leading-relaxed font-light">
            In compliance with our standard hospitality-grade security protocols, operators can reset workspace access directly. Set a strong password with at least 8 alphanumeric elements.
          </p>
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset portal password</h2>
            <p className="mt-2.5 text-sm text-slate-600 font-light">
              Enter email and specify your desired new password below.
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

                {success && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700 border border-emerald-150">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-emerald-800">Password reset processed successfully!</p>
                      <p className="mt-1 font-light">Your portal credentials have updated. You may now return to the login frame.</p>
                    </div>
                  </div>
                )}

                {!success && (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Registered Email
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
                        New Passcode
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="••••••••••••"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Confirm Passcode
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="••••••••••••"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:shadow-none disabled:active:scale-100 cursor-pointer"
                      >
                        {loading ? 'Processing...' : 'Apply New Password'}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm font-light text-slate-600">
                  Ready to sign in?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Go back to Login
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
