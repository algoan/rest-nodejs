import { EventName, EventStatus } from './Algoan.enum';

/**
 * Service account body
 */
export interface IServiceAccount {
  id: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
  widgetConfig?: IWidgetConfig;
}

/**
 * Widget configuration interface
 */
export interface IWidgetConfig {
  iframe?: IIFrameConfig;
}

/**
 * IFrame configuration interface
 */
export interface IIFrameConfig {
  language?: string;
  font?: string;
  fontColor?: string;
}

/**
 * Subscription interface
 * https://developers.algoan.com/api/#operation/getResthookSubs
 */
export interface ISubscription {
  id: string;
  eventName: EventName;
  secret?: string;
  status: SubscriptionStatus;
  target: string;
}

/**
 * Subscription's event interface
 * https://developers.algoan.com/api/#operation/getResthookSubEvents
 */
export interface ISubscriptionEvent<IPayload extends { applicationId: string } = { applicationId: string }> {
  /** Index of the event */
  index: string;
  /** Payload sent through the resthook */
  payload: IPayload;
  /** Status history of the event */
  statuses: {
    createdAt: Date;
    name: EventStatus;
  }[];
  /** Subscription properties */
  subscription: ISubscription;
  /** When the resthook has been sent */
  time: number;
}

/**
 * Subscription statuses
 */
export type SubscriptionStatus = 'ACTIVE' | 'DISABLE' | 'INACTIVE';

/**
 * Multiple Resource Creation Response Scheme
 */
export interface MultiResourceCreationResponse<T> {
  elements: { resource: T; status: number }[];
  metadata: { failure: number; success: number; total: number };
}
