import {
  IBanksUser,
  BanksUserAccount,
  BanksUserTransaction,
  MultiResourceCreationResponse,
  AccountType,
  UsageType,
  BanksUserTransactionType,
  BanksUserStatus,
} from '../../src/lib';

export const banksUser: IBanksUser = {
  id: 'id1',
  status: BanksUserStatus.FINISHED,
  redirectUrl: 'mockRedirectUrl',
  redirectUrlCreatedAt: 1234567,
  redirectUrlTTL: 500,
  callbackUrl: 'mockCallbackUrl',
  plugIn: {
    budgetInsightBank: {
      baseUrl: 'mockBaseUrl',
      token: 'mockToken',
    },
  },
  scores: [],
  analysis: { alerts: [], regularCashFlows: [], reliability: 'HIGH' },
};

export const banksUserAccount: BanksUserAccount = {
  id: 'accountId1',
  balance: 100,
  balanceDate: '23/06/2020',
  connectionSource: 'mockConnectionSource',
  currency: 'EUR',
  type: AccountType.SAVINGS,
  usage: UsageType.PERSONAL,
};

export const banksUserTransaction: BanksUserTransaction = {
  id: 'transactionId1',
  amount: 50,
  category: 'mockCategory',
  date: '23/06/2020',
  description: 'mockDescription',
  type: BanksUserTransactionType.ATM,
};

export const banksUserTransactionResponse: MultiResourceCreationResponse<BanksUserTransaction> = {
  elements: [{ resource: banksUserTransaction, status: 200 }],
  metadata: { failure: 0, success: 1, total: 1 },
};
