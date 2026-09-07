import { apiClient } from './axios';

export interface WalletTransferInput {
  recipient_account_number: string;
  amount: number;
  description?: string;
  pin_or_otp?: string;
}

export interface SetPinInput {
  pin: string;
}

export interface TransferPartyInfo {
  account_number: string;
  member_id: number;
  name: string;
  email: string;
  phone_number?: string;
}

export interface WalletTransferResponse {
  status: string;
  message: string;
  reference: string;
  amount: number;
  currency: string;
  sender: TransferPartyInfo;
  recipient: TransferPartyInfo;
  timestamp: string;
}

export interface WalletListItem {
  wallet_id: number;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
  user_id: number;
  email: string;
}

export interface WalletOverviewResponse {
  total: number;
  page: number;
  page_size: number;
  total_cooperative_balance: number;
  total_wallets_count: number;
  items: WalletListItem[];
}

export interface WalletTransactionItem {
  id: number;
  reference: string;
  amount: number;
  type: string;
  dr_cr: 'DR' | 'CR';
  status: string;
  description: string;
  created_at: string;
}

export interface WalletTransactionsResponse {
  wallet_id: number;
  account_number: string;
  account_name: string;
  balance: number;
  currency: string;
  total_transactions: number;
  page: number;
  page_size: number;
  items: WalletTransactionItem[];
}

export const walletApi = {
  setTransactionPin: async (payload: SetPinInput): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      '/users/me/transaction-pin',
      payload
    );
    return data;
  },
  transferBetweenMembers: async (
    payload: WalletTransferInput
  ): Promise<WalletTransferResponse> => {
    const { data } = await apiClient.post<WalletTransferResponse>(
      '/wallet/transfer',
      payload
    );
    return data;
  },

  getWalletsOverview: async (
    params?: { skip?: number; limit?: number; search?: string }
  ): Promise<WalletOverviewResponse> => {
    const { data } = await apiClient.get<WalletOverviewResponse>('/wallet', { params });
    return data;
  },

  // Fetch transactions for selected wallet
  getWalletTransactions: async (
    walletId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<WalletTransactionsResponse> => {
    const { data } = await apiClient.get<WalletTransactionsResponse>(
      `/wallet/${walletId}/transactions`,
      { params }
    );
    return data;
  },

};
