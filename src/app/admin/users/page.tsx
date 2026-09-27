'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { IslamicStarIcon } from '../../../components/common/IslamicPattern';
import { Users, ArrowLeft, Shield, Search, UserCheck, Ban, CheckCircle } from 'lucide-react';
import { INITIAL_USERS } from '../../../data/mockData';

export default function AdminUsersDirectoryPage() {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState(INITIAL_USERS);

  const handleToggleStatus = (userId: string, currentStatus?: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole = u.role === 'visitor' ? 'participant' : u.role;
          return { ...u, role: newRole };
        }
        return u;
      })
    );
    addToast('User role updated successfully.', 'success');
  };

  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-[#0f172a]">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IslamicStarIcon size={16} className="text-[#064e3b]" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[#064e3b] uppercase">
              ROLE-BASED ACCESS CONTROL (RBAC) DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1 tracking-tight">
            User Accounts, Roles &amp; Permissions
          </h1>
          <p className="text-xs text-[#475569]">
            Manage granular privileges for superadmins, judges, event managers, staff marshals, and participants.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold text-[#0f172a] hover:border-[#064e3b] flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft size={14} />
          <span>Back to Console</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-2.5 text-[#9ca3af]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d6] text-xs text-[#0f172a] focus:border-[#064e3b] focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e7e2d6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-[10px] font-bold tracking-wider uppercase text-[#6b7280] border-b border-[#e7e2d6]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Academic Title</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f0e6]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#faf8f5] border border-[#e7e2d6] overflow-hidden shrink-0">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-[#0f172a] block">{u.name}</span>
                        <span className="text-[11px] text-[#6b7280]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        u.role === 'admin' || u.role === 'superadmin'
                          ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                          : u.role === 'judge'
                          ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                          : 'bg-[#faf8f5] text-[#4b5563] border-[#e7e2d6]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{u.title || 'General Attendee'}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6b7280]">{u.phone || '—'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#faf8f5] border border-[#e7e2d6] text-xs font-semibold hover:border-[#064e3b] text-[#064e3b] cursor-pointer"
                    >
                      Inspect Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
