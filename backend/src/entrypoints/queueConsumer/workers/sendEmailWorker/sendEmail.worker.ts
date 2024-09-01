import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailerInterface } from '@/infrastructure/clientMailer/mailer.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { sendEmailWorkerSchema } from './sendEmail.worker.schema';
import { WorkerInterface } from '..';

export const getSendEmailWorker = (): WorkerInterface => {
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);
  const mailer = mainContainer.get<MailerInterface>(TYPES.Mailer);
  return {
    queue: QueueName.SEND_EMAIL,
    handler: (data: unknown) => {
      const options = sendEmailWorkerSchema.parse(data);
      logger.debug('[Worker] start sending email');
      return mailer.sendMail(options);
    },
  };
};
