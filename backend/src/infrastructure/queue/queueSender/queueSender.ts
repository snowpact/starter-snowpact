import { inject, injectable } from 'inversify';

import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';
import { SendEmailWorkerOptions } from '@/entrypoints/queueConsumer/workers/sendEmailWorker/sendEmail.worker.schema';

import { QueueSenderInterface } from './queueSender.interface';

@injectable()
export class QueueSender implements QueueSenderInterface {
  constructor(@inject(TYPES.ClientQueue) private clientQueue: ClientQueueInterface) {}

  async sendEmail(options: SendEmailWorkerOptions): Promise<void> {
    await this.clientQueue.sendJob(QueueName.SEND_EMAIL, options);
  }
}
