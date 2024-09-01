import 'reflect-metadata';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { crons } from './crons';

export async function setupCron() {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  const clientQueue = mainContainer.get<ClientQueueInterface>(TYPES.ClientQueue);

  await clientQueue.start(envConfig.dbUrl);

  await clientQueue.setupAllQueues();
  await clientQueue.removeOldSchedules(crons.map((cron) => cron.queue));
  await Promise.all(crons.map((cron) => clientQueue.scheduleCron(cron)));

  await clientQueue.stop();
}

void setupCron();
