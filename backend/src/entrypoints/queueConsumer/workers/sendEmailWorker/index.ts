import { z } from 'zod';

import { MailerInterface } from '@/infrastructure/clientMailer/mailer.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { QueueName } from '@/domain/enums/queues.enum';

import { WorkerInterface } from '..';

export const getSendEmailWorker = (): WorkerInterface => {
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
      return mailer.sendMail(options);
    },
  };
};
