import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';
import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { bootstrap } from './loader/server';

let clientDatabase: ClientDatabaseInterface;
let server: ServerType;
let appLogger: LoggerInterface;

const init = async () => {
  try {
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    const envConfig = mainContainer.get<EnvConfigInterface>(TYPES.EnvConfig);
    appLogger = mainContainer.get<LoggerInterface>(TYPES.Logger);

    await clientDatabase.connect(envConfig.dbUrl);
    const bootstrapData = bootstrap();

    server = bootstrapData.server;
  } catch (error) {
    appLogger.error('Error starting server', error);

    await clientDatabase.disconnect();
    server.close();
    process.exit(1);
  }
};

void init();
