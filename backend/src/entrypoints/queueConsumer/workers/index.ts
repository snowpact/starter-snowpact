import { QueueName } from '@/domain/enums/queues.enum';

import { getClearExpiredTokenWorker } from './clearExpiredTokenWorker/clearExpireToken.worker';
import { getSendEmailWorker } from './sendEmailWorker/sendEmail.worker';

export interface WorkerInterface {
  queue: QueueName;
  handler: (data: unknown) => Promise<void>;
}

export const workers = [getSendEmailWorker(), getClearExpiredTokenWorker()];
