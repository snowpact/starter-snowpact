import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { bootstrap } from './loader/server';

let clientDatabase: ClientDatabaseInterface;
let clientQueue: ClientQueueInterface;
let server: ServerType;
let appLogger: LoggerInterface;

const init = async () => {
  try {
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    clientQueue = mainContainer.get<ClientQueueInterface>(TYPES.ClientQueue);
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);

    await clientDatabase.connect(envConfig.dbUrl);
    await clientQueue.start(envConfig.dbUrl);
    const bootstrapData = bootstrap();

    server = bootstrapData.server;
  } catch (error) {
    appLogger.error('Error starting server', error);

    await clientDatabase.disconnect();
    await clientQueue.stop();
    server.close();
    process.exit(1);
  }
};

void init();
