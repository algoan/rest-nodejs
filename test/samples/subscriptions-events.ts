import { EventName, EventStatus } from '../../src/lib/Algoan.enum';
import { ISubscriptionEvent } from '../../src/lib/Algoan.interface';

export const subscriptionEvents: ISubscriptionEvent[] = [
  {
    index: '0',
    payload: {
      applicationId: 'applicationId',
    },
    statuses: [
      {
        createdAt: new Date(),
        name: EventStatus.IN_PROGRESS,
      },
    ],
    subscription: {
      id: 'sub1',
      target: 'http://mydns.com',
      secret: 'a',
      eventName: EventName.APPLICATION_UPDATED,
      status: 'ACTIVE',
    },
    time: Date.now(),
  },
  {
    index: '1',
    payload: {
      applicationId: 'applicationId',
    },
    statuses: [
      {
        createdAt: new Date(),
        name: EventStatus.IN_PROGRESS,
      },
      {
        createdAt: new Date(),
        name: EventStatus.ACK,
      },
    ],
    subscription: {
      id: 'sub1',
      target: 'http://mydns.com',
      secret: 'a',
      eventName: EventName.APPLICATION_UPDATED,
      status: 'ACTIVE',
    },
    time: Date.now(),
  },
];
