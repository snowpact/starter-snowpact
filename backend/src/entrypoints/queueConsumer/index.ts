import 'reflect-metadata';
import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { workers } from './workers';

export async function setupCron() {
  const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
  const clientQueue = mainContainer.get<ClientQueueInterface>(TYPES.ClientQueue);
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);

  await clientDatabase.connect(envConfig.dbUrl);
  await clientQueue.start(envConfig.dbUrl);

  await clientQueue.setupAllQueues();
  await Promise.all(workers.map((worker) => clientQueue.setupWorker(worker.queue, worker.handler)));
}

void setupCron();
