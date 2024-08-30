import { Mocked, vi } from 'vitest';

import { ClientQueueInterface } from './clientQueue.interface';

export const getClientQueueMock = (): Mocked<ClientQueueInterface> => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
  createQueue: vi.fn().mockResolvedValue(undefined),
  setupAllQueues: vi.fn().mockResolvedValue(undefined),
  removeQueue: vi.fn().mockResolvedValue(undefined),
  sendJob: vi.fn().mockResolvedValue(undefined),
  scheduleCron: vi.fn().mockResolvedValue(undefined),
  removeSchedule: vi.fn().mockResolvedValue(undefined),
  removeOldSchedules: vi.fn().mockResolvedValue(undefined),
  getAllScheduleIds: vi.fn().mockResolvedValue(undefined),
  setupWorker: vi.fn().mockResolvedValue(undefined),
});
