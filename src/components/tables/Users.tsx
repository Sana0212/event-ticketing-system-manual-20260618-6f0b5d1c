'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface UsersTableProps {
  onRefresh?: () => void;
}

export default function UsersTable({ onRefresh }: UsersTableProps) {
  const { user: currentUser } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (id === currentUser?.userId) {
      alert('You cannot delete your own account.');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadUsers();
        if (onRefresh) onRefresh();
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCurrentAdmin = currentUser?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-slate-700">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 uppercase tracking-wider text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-3.5 text-left">Name</th>
            <th className="px-6 py-3.5 text-left">Email</th>
            <th className="px-6 py-3.5 text-left">Role</th>
            <th className="px-6 py-3.5 text-left">Phone</th>
            <th className="px-6 py-3.5 text-left">Status</th>
            <th className="px-6 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No users found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.first_name || item.fullName || ''} {item.last_name || ''}
                </td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4 uppercase text-xs tracking-wider font-semibold text-slate-600">
                  {item.role_key?.replace('_', ' ') || item.role}
                </td>
                <td className="px-6 py-4">{item.phone || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/settings/users/${item.id}`}
                      className="p-1 text-slate-500 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {isCurrentAdmin && (
                      <Link
                        href={`/settings/users/${item.id}/edit`}
                        className="p-1 text-slate-500 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    )}
                    {isCurrentAdmin && item.id !== currentUser?.userId && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
