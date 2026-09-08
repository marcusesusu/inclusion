'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Pencil,
  Loader2,
  Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { FormButton } from '@/components/ui/form-button';
import { Modal } from '@/components/ui/modal';
import { DataTable, Column } from '@/components/ui/data-table';
import { UserItem, adminApi } from '@/lib/admin';
import { walletApi, WalletTransferResponse } from '@/lib/wallet';

const ROLE_OPTIONS = [
  { label: 'Staff', value: 'staff' },
  { label: 'Admin', value: 'admin' },
  { label: 'Branch Manager', value: 'branch_manager' },
];

const createStaffSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional(),
  role: z.string().min(1, 'Role selection is required'),
});

type CreateStaffInput = z.infer<typeof createStaffSchema>;

const editUserSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  phone_number: z.string().optional(),
  role: z.string().min(1, 'Role selection is required'),
});

type EditUserInput = z.infer<typeof editUserSchema>;

const transferWalletSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be greater than zero',
    }),
  description: z.string().optional(),
});

type TransferWalletInput = z.infer<typeof transferWalletSchema>;

export default function TeamPage() {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null);
  const [transferTargetUser, setTransferTargetUser] = React.useState<UserItem | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers(page, limit);
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch (err: unknown) {
      toast.error('Failed to load team members.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addFormMethods = useForm<CreateStaffInput>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'staff',
    },
  });

  const editFormMethods = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
  });

  const transferFormMethods = useForm<TransferWalletInput>({
    resolver: zodResolver(transferWalletSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });

  const onAddStaff = async (data: CreateStaffInput) => {
    try {
      await adminApi.createStaff(data);
      toast.success(`Staff user created! Login credentials sent to ${data.email}`);
      setIsAddModalOpen(false);
      addFormMethods.reset();
      fetchUsers();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.data?.detail ||
        err?.message ||
        'Failed to create staff member.';

      toast.error(errorMessage);
    }
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    editFormMethods.reset({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      role: user.role || 'staff',
    });
  };

  const handleOpenTransfer = (user: UserItem) => {
    setTransferTargetUser(user);
    transferFormMethods.reset({
      amount: '',
      description: '',
    });
  };

  const onUpdateUser = async (data: EditUserInput) => {
    if (!editingUser) return;
    try {
      await adminApi.updateUser(editingUser.id, data);
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      toast.error('Failed to update user details.');
    }
  };

  const onTransferToStaff = async (data: TransferWalletInput) => {
    if (!transferTargetUser) return;

    // Retrieve target account number (falling back to user profile property if present)
    const recipientAccountNumber =
      (transferTargetUser as any).account_number ||
      (transferTargetUser as any).wallet?.account_number;

    if (!recipientAccountNumber) {
      toast.error('Target staff member does not have a valid wallet account number.');
      return;
    }

    try {
      const res: WalletTransferResponse = await walletApi.transferBetweenMembers({
        recipient_account_number: recipientAccountNumber,
        amount: Number(data.amount),
        description: data.description || 'Admin transfer to staff',
      });

      toast.success(res.message || 'Transfer completed successfully.');
      setTransferTargetUser(null);
      transferFormMethods.reset();
      fetchUsers();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.data?.detail ||
        err?.message ||
        'Failed to transfer funds to staff wallet.';

      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    setActionLoadingId(user.id);
    try {
      if (user.is_active) {
        await adminApi.deactivateUser(user.id);
        toast.success(`Account for ${user.first_name || user.email} deactivated.`);
      } else {
        await adminApi.activateUser(user.id);
        toast.success(`Account for ${user.first_name || user.email} activated.`);
      }
      fetchUsers();
    } catch (err: unknown) {
      toast.error('Failed to change user status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

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
          <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground uppercase">
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
        key: 'joined',
        header: 'Joined',
        cell: (user) => (
          <span className="text-muted-foreground">
            {new Date(user.created_at).toLocaleDateString()}
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
              onClick={() => handleOpenTransfer(user)}
              className="rounded-lg p-1.5 flex gap-2 bg-amber-500/10 text-amber-600 hover:bg-rose-500/20 hover:bg-accent hover:text-primary transition-colors cursor-pointer"
              title="Transfer Funds to Staff"
            >
              <Wallet className="h-3.5 w-3.5" /> Fund Wallet
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(user)}
              className="rounded-lg p-1.5 flex gap-1 items-center bg-green-500/10 text-green-600 hover:bg-rose-500/20 hover:bg-accent hover:text-primary transition-colors cursor-pointer"
              title="Edit User"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={() => handleToggleStatus(user)}
              disabled={actionLoadingId === user.id}
              className={`rounded-lg p-2 text-[10px] font-semibold transition-colors cursor-pointer ${
                user.is_active
                  ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
              }`}
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Team Management</h1>
          <p className="text-xs text-muted-foreground">
            Manage organization staff members, roles, access permissions, and wallet transfers.
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

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No staff or team members found."
        pageCount={Math.ceil(total / limit)}
        pageIndex={page - 1}
        pageSize={limit}
        totalItems={total}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Staff Member"
      >
        <FormProvider {...addFormMethods}>
          <form onSubmit={addFormMethods.handleSubmit(onAddStaff)} className="space-y-4">
            <FormInput name="first_name" label="First Name" placeholder="John" />
            <FormInput name="last_name" label="Last Name" placeholder="Doe" />
            <FormInput name="email" label="Email Address" type="email" placeholder="john.doe@company.com" />
            <FormInput name="phone_number" label="Phone Number" placeholder="+2348000000000" />
            <FormSelect
              name="role"
              label="Role"
              options={ROLE_OPTIONS}
              placeholder="Select a role"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <FormButton isLoading={addFormMethods.formState.isSubmitting} className="w-auto px-4 py-2">
                Create & Send Invite
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Edit User Profile"
      >
        <FormProvider {...editFormMethods}>
          <form onSubmit={editFormMethods.handleSubmit(onUpdateUser)} className="space-y-4">
            <FormInput name="first_name" label="First Name" />
            <FormInput name="last_name" label="Last Name" />
            <FormInput name="phone_number" label="Phone Number" />
            <FormSelect
              name="role"
              label="Role"
              options={ROLE_OPTIONS}
              placeholder="Select a role"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <FormButton isLoading={editFormMethods.formState.isSubmitting} className="w-auto px-4 py-2">
                Save Changes
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* Internal Transfer Modal */}
      <Modal
        isOpen={Boolean(transferTargetUser)}
        onClose={() => setTransferTargetUser(null)}
        title={`Transfer Funds to ${transferTargetUser?.first_name || transferTargetUser?.email || ''}`}
      >
        <FormProvider {...transferFormMethods}>
          <form onSubmit={transferFormMethods.handleSubmit(onTransferToStaff)} className="space-y-4">
            <FormInput
              name="amount"
              label="Amount"
              type="number"
              placeholder="e.g. 5000"
            />
            <FormInput
              name="description"
              label="Narration / Note"
              placeholder="e.g. Staff operational allowance"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setTransferTargetUser(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <FormButton
                isLoading={transferFormMethods.formState.isSubmitting}
                className="w-auto px-4 py-2"
              >
                Transfer Funds
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
}
