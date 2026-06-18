'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { mainNav, NavItem, byRoleNavigation } from '@/components/app/navConfig';
import { LogOut, Menu, X, Shield, CalendarDays } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logout();
      window.location.href = '/login';
    }
  };

  const userRole = user?.role || 'support';
  const allowedRoutes = byRoleNavigation[userRole] || [];

  // Filter main navigation based on the user's role
  const renderedNav = mainNav.filter((item) => {
    // Exact check or startsWith check
    return allowedRoutes.some((route) => item.route === route || item.route.startsWith(route));
  });

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <CalendarDays className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 tracking-tight text-md block leading-none">
                MonstarX Events
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase block mt-1">
                Hospitality Hub
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Main Menu
            </span>
          </div>

          {renderedNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.route || pathname?.startsWith(item.route + '/');

            return (
              <Link
                key={item.route}
                href={item.route}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold self-start">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate leading-tight">
                {user?.fullName || 'Active User'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3.5 w-3.5 text-indigo-500" />
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {userRole.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href="/settings"
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
