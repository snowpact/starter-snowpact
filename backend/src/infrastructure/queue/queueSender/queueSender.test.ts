import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getClientQueueMock } from '@/infrastructure/queue/clientQueue/clientQueue.mock';

import { QueueSender } from './queueSender';

describe('QueueSender', () => {
  const clientQueueMock = getClientQueueMock();
  const queueSender = new QueueSender(clientQueueMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test HTML</p>';

      await queueSender.sendEmail({ to: email, subject, html });

      expect(clientQueueMock.sendJob).toHaveBeenCalled();
    });
  });
});
