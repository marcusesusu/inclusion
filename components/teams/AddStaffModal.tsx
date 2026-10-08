// @/components/team/AddStaffModal.tsx
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { FormButton } from '@/components/ui/form-button';
import { PermissionSelector } from './PermissionSelector';
import { TabType } from '@/settings';
import { adminApi } from '@/lib/admin';

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

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [permissions, setPermissions] = React.useState<TabType[]>([]);

  const formMethods = useForm<CreateStaffInput>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'staff',
    },
  });

  const onSubmit = async (data: CreateStaffInput) => {
    try {
      await adminApi.createStaff({
        ...data,
        allowed_checkers: permissions, // Attach permission payload
      });
      toast.success(`Staff created successfully! Invitation sent to ${data.email}`);
      formMethods.reset();
      setPermissions([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to create staff member.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Staff Member">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="first_name" label="First Name" placeholder="John" />
          <FormInput name="last_name" label="Last Name" placeholder="Doe" />
          <FormInput name="email" label="Email Address" type="email" placeholder="john@company.com" />
          <FormInput name="phone_number" label="Phone Number" placeholder="+2348000000000" />
          <FormSelect name="role" label="Role" options={ROLE_OPTIONS} />

          {/* Checker Permissions Manager */}
          <PermissionSelector
            selectedPermissions={permissions}
            onChange={setPermissions}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
            <FormButton isLoading={formMethods.formState.isSubmitting} className="w-auto px-4 py-2">
              Create & Send Invite
            </FormButton>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
