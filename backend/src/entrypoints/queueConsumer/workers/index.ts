import { QueueName } from '@/domain/enums/queues.enum';

import { getClearExpiredTokenWorker } from './clearExpiredTokenWorker';
import { getSendEmailWorker } from './sendEmailWorker';

export interface WorkerInterface {
  queue: QueueName;
  handler: (data: unknown) => Promise<void>;
}

export const workers = [getSendEmailWorker(), getClearExpiredTokenWorker()];
