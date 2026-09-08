'use client';

import * as React from 'react';
import {
  Search,
  Wallet,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Modal } from '@/components/ui/modal';
import { DataTable, Column } from '@/components/ui/data-table';
import {
  walletApi,
  WalletListItem,
  WalletTransactionItem,
} from '@/lib/wallet';

export default function WalletOverviewPage() {
  const [wallets, setWallets] = React.useState<WalletListItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Overview metrics
  const [metrics, setMetrics] = React.useState({
    totalBalance: 0,
    totalWallets: 0,
  });

  // Modal / Transaction History state
  const [selectedWallet, setSelectedWallet] = React.useState<WalletListItem | null>(null);
  const [transactions, setTransactions] = React.useState<WalletTransactionItem[]>([]);
  const [txTotal, setTxTotal] = React.useState(0);
  const [txPage, setTxPage] = React.useState(1);
  const txLimit = 10;
  const [isLoadingTx, setIsLoadingTx] = React.useState(false);

  const fetchWallets = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await walletApi.getWalletsOverview({
        skip: (page - 1) * limit,
        limit,
        search: searchTerm,
      });
      setWallets(data.items || []);
      setTotal(data.total || 0);
      setMetrics({
        totalBalance: Number(data.total_cooperative_balance || 0),
        totalWallets: data.total_wallets_count || 0,
      });
    } catch (err: unknown) {
      toast.error('Failed to load wallet data.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm]);

  React.useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const fetchWalletTransactions = React.useCallback(
    async (walletId: number, targetPage: number) => {
      setIsLoadingTx(true);
      try {
        const data = await walletApi.getWalletTransactions(walletId, {
          skip: (targetPage - 1) * txLimit,
          limit: txLimit,
        });
        setTransactions(data.items || []);
        setTxTotal(data.total_transactions || 0);
      } catch (err: unknown) {
        toast.error('Failed to load wallet transaction history.');
      } finally {
        setIsLoadingTx(false);
      }
    },
    [txLimit]
  );

  const handleOpenHistory = (wallet: WalletListItem) => {
    setSelectedWallet(wallet);
    setTxPage(1);
    fetchWalletTransactions(wallet.wallet_id, 1);
  };

  const handleTxPageChange = (newPageIndex: number) => {
    const nextPage = newPageIndex + 1;
    setTxPage(nextPage);
    if (selectedWallet) {
      fetchWalletTransactions(selectedWallet.wallet_id, nextPage);
    }
  };

  // Main Table Columns
  const columns = React.useMemo<Column<WalletListItem>[]>(
    () => [
      {
        key: 'account_name',
        header: 'Account Name',
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {(item.account_name?.[0] || item.email[0]).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-foreground">{item.account_name}</div>
              <div className="text-[10px] text-muted-foreground">{item.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'account_number',
        header: 'Account Number',
        cell: (item) => (
          <span className="font-mono text-xs text-foreground font-medium">
            {item.account_number}
          </span>
        ),
      },
      {
        key: 'balance',
        header: 'Remaining Balance',
        cell: (item) => (
          <div className="font-semibold text-foreground">
            {item.currency}{' '}
            {Number(item.balance).toLocaleString('en-NG', {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        key: 'actions',
        header: <div className="text-right">Actions</div>,
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleOpenHistory(item)}
              className="rounded-lg p-1.5 flex gap-1.5 items-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer text-xs font-semibold"
              title="View History"
            >
              <Eye className="h-3.5 w-3.5" /> History
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Modal Transaction History Table Columns
  const txColumns = React.useMemo<Column<WalletTransactionItem>[]>(
    () => [
      {
        key: 'reference',
        header: 'Reference',
        cell: (tx) => (
          <span className="font-mono text-[11px] text-muted-foreground">{tx.reference}</span>
        ),
      },
      {
        key: 'type',
        header: 'Type',
        cell: (tx) => (
          <span className="capitalize text-xs font-medium text-foreground">
            {tx.type}
          </span>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        cell: (tx) => (
          <div
            className={`flex items-center gap-1 font-semibold text-xs ${
              tx.dr_cr === 'DR' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {tx.dr_cr === 'DR' ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownLeft className="h-3.5 w-3.5" />
            )}
            {tx.dr_cr === 'DR' ? '-' : '+'}
            {selectedWallet?.currency || 'NGN'}{' '}
            {Number(tx.amount).toLocaleString('en-NG', {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        cell: (tx) => (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
              tx.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-amber-500/10 text-amber-600'
            }`}
          >
            {tx.status}
          </span>
        ),
      },
      {
        key: 'date',
        header: 'Date',
        cell: (tx) => (
          <span className="text-muted-foreground text-xs">
            {new Date(tx.created_at).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [selectedWallet]
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Wallet Management</h1>
          <p className="text-xs text-muted-foreground">
            Overview of member wallet balances, activity logs, and system metrics.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Cooperative Balance</p>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              ₦
              {metrics.totalBalance.toLocaleString('en-NG', {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Member Wallets</p>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              {metrics.totalWallets}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by account name or account number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
        />
      </div>

      {/* Wallets Data Table */}
      <DataTable
        columns={columns}
        data={wallets}
        isLoading={isLoading}
        emptyMessage="No member wallets found."
        pageCount={Math.ceil(total / limit)}
        pageIndex={page - 1}
        pageSize={limit}
        totalItems={total}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
      />

      {/* Transaction History Modal */}
      <Modal
        isOpen={Boolean(selectedWallet)}
        onClose={() => setSelectedWallet(null)}
        title={`Wallet History — ${selectedWallet?.account_name || ''}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-accent p-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Account Number</p>
              <p className="font-mono text-xs font-bold text-foreground">
                {selectedWallet?.account_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Current Balance</p>
              <p className="text-xs font-bold text-primary">
                {selectedWallet?.currency}{' '}
                {Number(selectedWallet?.balance || 0).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <DataTable
            columns={txColumns}
            data={transactions}
            isLoading={isLoadingTx}
            emptyMessage="No transactions recorded for this wallet."
            pageCount={Math.ceil(txTotal / txLimit)}
            pageIndex={txPage - 1}
            pageSize={txLimit}
            totalItems={txTotal}
            onPageChange={handleTxPageChange}
          />
        </div>
      </Modal>
    </div>
  );
}
