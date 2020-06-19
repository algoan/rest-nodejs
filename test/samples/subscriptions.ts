import { EventName } from '../../src/lib/Algoan.enum';
import { Subscription } from '../../src/core/Subscription';

export const subscriptions: Subscription[] = [
  {
    id: 'sub1',
    target: 'http://mydns.com',
    secret: 'a',
    eventName: EventName.APPLICATION_UPDATED,
    status: 'ACTIVE',
  },
  {
    id: 'sub2',
    target: 'http://mydns.com',
    secret: 'b',
    eventName: EventName.LEGAL_DOCUMENTS_REQUIRED,
    status: 'ACTIVE',
  },
] as Subscription[];
