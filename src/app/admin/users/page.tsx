'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { INITIAL_USERS } from '../../../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { Avatar } from '../../../components/ui/avatar';
import { Users, ArrowLeft, Shield, Search, UserCheck } from 'lucide-react';

export default function AdminUsersDirectoryPage() {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState(INITIAL_USERS);

  const handleToggleStatus = (userId: string) => {
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Accounts &amp; Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage system access roles, staff authorizations, and judge permissions.
          </p>
        </div>

        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft size={14} />
            <span>Back to Admin</span>
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">System Directory ({userList.length})</CardTitle>
            <CardDescription className="text-xs">
              Role-based access control assignments.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or role..."
              className="pl-8 text-xs h-8"
            />
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Account ID</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-semibold text-slate-900">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} alt={u.name} fallback={u.name} className="w-8 h-8" />
                    <span>{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{u.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === 'admin' || u.role === 'superadmin'
                        ? 'default'
                        : u.role === 'judge'
                        ? 'warning'
                        : u.role === 'staff'
                        ? 'info'
                        : 'secondary'
                    }
                    className="capitalize text-[10px]"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-400">{u.id}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5"
                    onClick={() => handleToggleStatus(u.id)}
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
