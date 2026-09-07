'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  CreditCard,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { FormInput } from '@/components/ui/form-input';
import { FormButton } from '@/components/ui/form-button';
import { Modal } from '@/components/ui/modal';
import { DataTable, Column } from '@/components/ui/data-table';
import { verificationApi } from '@/lib/verification';
import { VerificationLogItem, BaseKYCResponse } from '@/types/verification';

// Validation Schemas
const bvnSchema = z.object({
  bvn: z.string().length(11, 'BVN must be exactly 11 digits'),
  name: z.string().optional(),
  date_of_birth: z.string().optional(),
});

const ninSchema = z.object({
  nin: z.string().length(11, 'NIN must be exactly 11 digits'),
  date_of_birth: z.string().optional(),
});

const bankSchema = z.object({
  account_number: z.string().length(10, 'Account number must be 10 digits'),
  bank_code: z.string().min(3, 'Bank code is required'),
});

const cacSchema = z.object({
  rc_number: z.string().min(3, 'RC / BN Number is required'),
});

export default function IdentityVerificationPage() {
  const [activeTab, setActiveTab] = React.useState<'bvn' | 'nin' | 'bank' | 'cac'>('bvn');

  // Verification Logs State
  const [logs, setLogs] = React.useState<VerificationLogItem[]>([]);
  const [totalLogs, setTotalLogs] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [isLoadingLogs, setIsLoadingLogs] = React.useState(true);

  // Result Detail Modal State
  const [resultModalData, setResultModalData] = React.useState<BaseKYCResponse | null>(null);
  const [viewLogDetail, setViewLogDetail] = React.useState<VerificationLogItem | null>(null);

  const fetchLogs = React.useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const res = await verificationApi.getLogs((page - 1) * limit, limit);
      setLogs(res.items || []);
      setTotalLogs(res.total || 0);
    } catch (err: unknown) {
      toast.error('Failed to load verification logs.');
    } finally {
      setIsLoadingLogs(false);
    }
  }, [page, limit]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Form Initializations
  const bvnForm = useForm({ resolver: zodResolver(bvnSchema), defaultValues: { bvn: '', name: '', date_of_birth: '' } });
  const ninForm = useForm({ resolver: zodResolver(ninSchema), defaultValues: { nin: '', date_of_birth: '' } });
  const bankForm = useForm({ resolver: zodResolver(bankSchema), defaultValues: { account_number: '', bank_code: '' } });
  const cacForm = useForm({ resolver: zodResolver(cacSchema), defaultValues: { rc_number: '' } });

  const handleVerifyBVN = async (data: any) => {
    try {
      const res = await verificationApi.verifyBVN(data);
      setResultModalData(res);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'BVN verification failed.');
    }
  };

  const handleVerifyNIN = async (data: any) => {
    try {
      const res = await verificationApi.verifyNIN(data);
      setResultModalData(res);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'NIN verification failed.');
    }
  };

  const handleVerifyBank = async (data: any) => {
    try {
      const res = await verificationApi.verifyBankAccount(data);
      setResultModalData(res);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Bank Account verification failed.');
    }
  };

  const handleVerifyCAC = async (data: any) => {
    try {
      const res = await verificationApi.verifyCAC(data);
      setResultModalData(res);
      fetchLogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'CAC verification failed.');
    }
  };

  // Log Columns Configuration
  const logColumns = React.useMemo<Column<VerificationLogItem>[]>(
    () => [
      {
        key: 'verification_type',
        header: 'Verification Type',
        cell: (item) => (
          <span className="font-semibold text-foreground uppercase text-xs">
            {item.verification_type.replace(/_/g, ' ')}
          </span>
        ),
      },
      {
        key: 'identifier_used',
        header: 'Identifier',
        cell: (item) => <span className="font-mono text-xs">{item.identifier_used || '—'}</span>,
      },
      {
        key: 'provider',
        header: 'Provider',
        cell: (item) => <span className="capitalize text-xs font-medium">{item.provider}</span>,
      },
      {
        key: 'fee_amount',
        header: 'Fee',
        cell: (item) => (
          <span className="text-xs">
            {item.currency} {item.fee_amount.toFixed(2)}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        cell: (item) =>
          item.is_success ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" /> Success
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 text-xs">
              <XCircle className="h-3.5 w-3.5" /> Failed
            </span>
          ),
      },
      {
        key: 'created_at',
        header: 'Date',
        cell: (item) => (
          <span className="text-muted-foreground text-xs">
            {new Date(item.created_at).toLocaleString()}
          </span>
        ),
      },
      {
        key: 'actions',
        header: <div className="text-right">Actions</div>,
        cell: (item) => (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setViewLogDetail(item)}
              className="rounded-lg p-1.5 flex gap-1 items-center bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" /> View
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Identity & KYC Verification</h1>
        <p className="text-xs text-muted-foreground">
          Perform statutory KYC lookups, identity checks, and view complete audit trail history.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('bvn')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'bvn'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserCheck className="h-4 w-4" /> BVN Lookup
        </button>
        <button
          onClick={() => setActiveTab('nin')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'nin'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> NIN Lookup
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'bank'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="h-4 w-4" /> Bank Account Match
        </button>
        <button
          onClick={() => setActiveTab('cac')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'cac'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" /> CAC Business
        </button>
      </div>

      {/* Forms Section */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        {activeTab === 'bvn' && (
          <FormProvider {...bvnForm}>
            <form onSubmit={bvnForm.handleSubmit(handleVerifyBVN)} className="space-y-4 max-w-lg">
              <FormInput name="bvn" label="Bank Verification Number (BVN)" placeholder="22123456789" />
              <FormInput name="name" label="Full Name (Optional Match Check)" placeholder="John Doe" />
              <FormInput name="date_of_birth" label="Date of Birth" type="date" />
              <FormButton isLoading={bvnForm.formState.isSubmitting} className="w-auto px-6">
                Verify BVN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === 'nin' && (
          <FormProvider {...ninForm}>
            <form onSubmit={ninForm.handleSubmit(handleVerifyNIN)} className="space-y-4 max-w-lg">
              <FormInput name="nin" label="National Identity Number (NIN)" placeholder="11223344556" />
              <FormInput name="date_of_birth" label="Date of Birth" type="date" />
              <FormButton isLoading={ninForm.formState.isSubmitting} className="w-auto px-6">
                Verify NIN
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === 'bank' && (
          <FormProvider {...bankForm}>
            <form onSubmit={bankForm.handleSubmit(handleVerifyBank)} className="space-y-4 max-w-lg">
              <FormInput name="account_number" label="Account Number" placeholder="0123456789" />
              <FormInput name="bank_code" label="Bank Code" placeholder="e.g., 058 or 011" />
              <FormButton isLoading={bankForm.formState.isSubmitting} className="w-auto px-6">
                Validate Account
              </FormButton>
            </form>
          </FormProvider>
        )}

        {activeTab === 'cac' && (
          <FormProvider {...cacForm}>
            <form onSubmit={cacForm.handleSubmit(handleVerifyCAC)} className="space-y-4 max-w-lg">
              <FormInput name="rc_number" label="RC / BN / Business Registration Number" placeholder="RC1234567" />
              <FormButton isLoading={cacForm.formState.isSubmitting} className="w-auto px-6">
                Verify CAC Record
              </FormButton>
            </form>
          </FormProvider>
        )}
      </div>

      {/* Verification Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Recent Verification Activity</h2>
        </div>
        <DataTable
          columns={logColumns}
          data={logs}
          isLoading={isLoadingLogs}
          emptyMessage="No identity verification records found."
          pageCount={Math.ceil(totalLogs / limit)}
          pageIndex={page - 1}
          pageSize={limit}
          totalItems={totalLogs}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        />
      </div>

      {/* Verification Result Modal */}
      <Modal
        isOpen={Boolean(resultModalData)}
        onClose={() => setResultModalData(null)}
        title="Verification Result"
      >
        <div className="space-y-4">
          <div
            className={`flex items-center gap-2 p-3 rounded-xl border ${
              resultModalData?.status
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
            }`}
          >
            {resultModalData?.status ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <p className="text-xs font-semibold">{resultModalData?.message || 'Verification Completed'}</p>
          </div>

          <div className="rounded-xl border border-border bg-accent p-3">
            <pre className="text-[11px] font-mono whitespace-pre-wrap overflow-x-auto text-foreground">
              {JSON.stringify(resultModalData?.data || resultModalData?.detail, null, 2)}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setResultModalData(null)}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Historical Log Detail Modal */}
      <Modal
        isOpen={Boolean(viewLogDetail)}
        onClose={() => setViewLogDetail(null)}
        title="Verification Audit Log Detail"
      >
        {viewLogDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs border border-border p-3 rounded-xl bg-card">
              <div>
                <span className="text-muted-foreground">Type:</span>{' '}
                <strong className="uppercase">{viewLogDetail.verification_type}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Provider:</span>{' '}
                <strong className="capitalize">{viewLogDetail.provider}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Identifier:</span>{' '}
                <strong className="font-mono">{viewLogDetail.identifier_used}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Cost:</span>{' '}
                <strong>
                  {viewLogDetail.currency} {viewLogDetail.fee_amount}
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-accent p-3">
              <p className="text-[10px] text-muted-foreground mb-1 font-semibold">Response Data</p>
              <pre className="text-[11px] font-mono whitespace-pre-wrap overflow-x-auto text-foreground">
                {JSON.stringify(viewLogDetail.response_data || viewLogDetail.message, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
