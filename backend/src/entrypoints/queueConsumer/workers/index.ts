import { QueueName } from '@/domain/enums/queues.enum';

import { getSendEmailWorker } from './sendEmailWorker';

export interface WorkerInterface {
  queue: QueueName;
  handler: (data: unknown) => Promise<void>;
}

export const workers = [getSendEmailWorker()];
