import { z } from 'zod';

import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { MailerInterface } from '@/infrastructure/clientMailer/mailer.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { WorkerInterface } from '..';

export const getSendEmailWorker = (): WorkerInterface => {
  const logger = mainContainer.get<LoggerInterface>(TYPES.Logger);
  const mailer = mainContainer.get<MailerInterface>(TYPES.Mailer);
  return {
    queue: QueueName.SEND_EMAIL,
    handler: (data: unknown) => {
      const schema = z.object({
        to: z.string().email(),
        subject: z.string(),
        html: z.string(),
      });
      const options = schema.parse(data);
      logger.debug('[Worker] start sending email');
      return mailer.sendMail(options);
    },
  };
};
