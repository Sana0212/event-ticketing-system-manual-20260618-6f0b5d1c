'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useSession } from '@/hooks/useSession';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string(),
    role_key: z.string().min(1),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords must match',
  });

const forgotSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords must match',
  });

type FieldErrors = Record<string, string[] | undefined>;

function fieldError(errors: FieldErrors, key: string): string | undefined {
  return errors[key]?.[0];
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground outline-none ring-accent focus:ring-2';

const labelClass = 'text-sm font-medium text-foreground';

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useSession();
  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const registered = searchParams.get('registered') === '1';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? 'Sign-in failed');
      }
      await refreshSession();
      const from = searchParams.get('from') ?? '/dashboard';
      router.replace(from);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
        <p className="mt-1 text-sm text-muted">Use your work email and password.</p>
      </div>
      {registered ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Account created. You can sign in now.
        </p>
      ) : null}
      {authError ? <p className="text-sm text-red-400">{authError}</p> : null}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          {fieldError(fieldErrors, 'email') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'email')}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {fieldError(fieldErrors, 'password') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'password')}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-muted">
        <Link href="/forgot-password" className="font-medium text-accent hover:underline">
          Forgot password?
        </Link>
        {' · '}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}

export function RegisterPage() {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm: '',
    role_key: 'employee',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const { confirm: _c, ...payload } = parsed.data;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? 'Registration failed');
      }
      await refreshSession();
      router.replace('/dashboard');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h2>
        <p className="mt-1 text-sm text-muted">Register to access the application.</p>
      </div>
      {authError ? <p className="text-sm text-red-400">{authError}</p> : null}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className={labelClass} htmlFor="reg-first">
              First name
            </label>
            <input
              id="reg-first"
              className={inputClass}
              value={values.first_name}
              onChange={(e) => setValues({ ...values, first_name: e.target.value })}
            />
            {fieldError(fieldErrors, 'first_name') ? (
              <p className="text-xs text-red-400">{fieldError(fieldErrors, 'first_name')}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className={labelClass} htmlFor="reg-last">
              Last name
            </label>
            <input
              id="reg-last"
              className={inputClass}
              value={values.last_name}
              onChange={(e) => setValues({ ...values, last_name: e.target.value })}
            />
            {fieldError(fieldErrors, 'last_name') ? (
              <p className="text-xs text-red-400">{fieldError(fieldErrors, 'last_name')}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          {fieldError(fieldErrors, 'email') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'email')}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="reg-role">
            Role
          </label>
          <select
            id="reg-role"
            className={inputClass}
            value={values.role_key}
            onChange={(e) => setValues({ ...values, role_key: e.target.value })}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {fieldError(fieldErrors, 'password') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'password')}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="reg-confirm">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={values.confirm}
            onChange={(e) => setValues({ ...values, confirm: e.target.value })}
          />
          {fieldError(fieldErrors, 'confirm') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'confirm')}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [values, setValues] = useState({ email: '', password: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const parsed = forgotSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? 'Could not update password');
      }
      setSent(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reset password</h2>
        <p className="mt-1 text-sm text-muted">Enter your email and choose a new password.</p>
      </div>
      {authError ? <p className="text-sm text-red-400">{authError}</p> : null}
      {sent ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Password updated. You can sign in with your new password.
        </p>
      ) : null}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          {fieldError(fieldErrors, 'email') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'email')}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="forgot-password">
            New password
          </label>
          <input
            id="forgot-password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {fieldError(fieldErrors, 'password') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'password')}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="forgot-confirm">
            Confirm password
          </label>
          <input
            id="forgot-confirm"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            value={values.confirm}
            onChange={(e) => setValues({ ...values, confirm: e.target.value })}
          />
          {fieldError(fieldErrors, 'confirm') ? (
            <p className="text-xs text-red-400">{fieldError(fieldErrors, 'confirm')}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting || sent}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
      <p className="text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
