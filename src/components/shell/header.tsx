'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { Menu, Bell, Search, User, Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useSession();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm shadow-sm shadow-slate-100/50 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global search placeholder or Greeting */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Welcome back,</span>
          <span className="text-sm font-semibold text-slate-800">{user?.fullName || 'User'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Quick Tag (Header) */}
        {user?.role && (
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <Shield className="h-3 w-3 text-slate-400" />
            {user.role.replace('_', ' ')}
          </span>
        )}

        <div className="h-6 w-px bg-slate-200" />

        {/* User Dropdown / Profile Link */}
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-sm">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:block max-w-[120px] truncate">
            {user?.fullName?.split(' ')[0] || 'My Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
}
