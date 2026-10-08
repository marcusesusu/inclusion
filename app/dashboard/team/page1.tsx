// app/dashboard/team/page.tsx
'use client';

import * as React from 'react';
import { UserPlus, Search, CheckCircle2, XCircle, Pencil, Loader2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

import { DataTable, Column } from '@/components/ui/data-table';
import { UserItem, adminApi } from '@/lib/admin';
import { FormButton } from '@/components/ui/form-button';
import { AddStaffModal } from '@/components/teams/AddStaffModal';

export default function TeamPage() {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers(page, limit);
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load team members.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user: UserItem) => {
    setActionLoadingId(user.id);
    try {
      if (user.is_active) {
        await adminApi.deactivateUser(user.id);
        toast.success(`Deactivated ${user.first_name || user.email}`);
      } else {
        await adminApi.activateUser(user.id);
        toast.success(`Activated ${user.first_name || user.email}`);
      }
      fetchUsers();
    } catch {
      toast.error('Failed to change user status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns = React.useMemo<Column<UserItem>[]>(
    () => [
      {
        key: 'member',
        header: 'Member',
        cell: (user) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {(user.first_name?.[0] || user.email[0]).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Unnamed User'}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'contact',
        header: 'Contact',
        cell: (user) => (
          <div className="text-muted-foreground">
            <div>{user.email}</div>
            <div className="text-[10px]">{user.phone_number || '—'}</div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        cell: (user) => (
          <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold uppercase">
            {user.role}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        cell: (user) =>
          user.is_active ? (
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-rose-600">
              <XCircle className="h-3.5 w-3.5" /> Inactive
            </span>
          ),
      },
      {
        key: 'actions',
        header: <div className="text-right">Actions</div>,
        cell: (user) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleToggleStatus(user)}
              disabled={actionLoadingId === user.id}
              className="rounded-lg p-2 text-[10px] font-semibold transition-colors bg-rose-500/10 text-rose-600"
            >
              {actionLoadingId === user.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : user.is_active ? (
                'Deactivate'
              ) : (
                'Activate'
              )}
            </button>
          </div>
        ),
      },
    ],
    [actionLoadingId]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Team Management</h1>
          <p className="text-xs text-muted-foreground">
            Manage organization members, assign verification permissions, and monitor access.
          </p>
        </div>
        <FormButton
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          icon={<UserPlus className="h-4 w-4" />}
          className="w-auto px-4 py-2"
        >
          Add Staff Member
        </FormButton>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No team members found."
        pageCount={Math.ceil(total / limit)}
        pageIndex={page - 1}
        pageSize={limit}
        totalItems={total}
        onPageChange={(p) => setPage(p + 1)}
      />

      {/* Modular Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
