import { ContainerModule, interfaces } from 'inversify';

import { MailerInterface } from '@/infrastructure/clientMailer/mailer.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { Mailer } from '@/infrastructure/clientMailer/mailer';
import { ClientDatabase } from '@/infrastructure/database/clientDatabase/clientDatabase';
import { ClientQueue } from '@/infrastructure/queue/clientQueue/clientQueue';

import { TYPES } from './types';

const infraContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<ClientDatabaseInterface>(TYPES.ClientDatabase).to(ClientDatabase).inSingletonScope();
  bind<ClientQueueInterface>(TYPES.ClientQueue).to(ClientQueue).inSingletonScope();
  bind<MailerInterface>(TYPES.Mailer).to(Mailer);
});

export { infraContainer };
