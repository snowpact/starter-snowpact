import { SendEmailWorkerOptions } from '@/entrypoints/queueConsumer/workers/sendEmailWorker/sendEmail.worker.schema';

export interface QueueSenderInterface {
  sendEmail(options: SendEmailWorkerOptions): Promise<void>;
}
