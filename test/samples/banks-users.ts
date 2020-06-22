import { IBanksUser } from '../../src/lib';

export const banksUser: IBanksUser = {
  id: 'id1',
  status: 'FINISHED',
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
