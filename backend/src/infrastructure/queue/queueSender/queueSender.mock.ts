import { Mocked, vi } from 'vitest';

import { QueueSenderInterface } from './queueSender.interface';

export const getQueueSenderMock = (): Mocked<QueueSenderInterface> => {
  return {
    sendEmail: vi.fn(),
  };
};
