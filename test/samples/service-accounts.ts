import { ServiceAccount } from '../../src/lib';

export const serviceAccounts: ServiceAccount[] = [
  {
    id: 'id1',
    clientId: 'clientId1',
    clientSecret: 'clientSecret1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'id2',
    clientId: 'clientId2',
    clientSecret: 'clientSecret2',
    createdAt: new Date().toISOString(),
  },
];
