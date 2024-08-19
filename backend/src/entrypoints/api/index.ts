import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { envConfig } from '@/configuration/env/envConfig.singleton';
import { appLogger } from '@/configuration/logger/logger.singleton';

import { bootstrap } from './loader/server';

let clientDatabase: ClientDatabaseInterface;
let server: ServerType;

const init = async () => {
  try {
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    await clientDatabase.connect(envConfig.dbUrl);
    await clientDatabase.getDataSource().runMigrations({ transaction: 'all' });
    const bootstrapData = bootstrap();
    server = bootstrapData.server;
  } catch (error) {
    if (error instanceof Error) {
      appLogger.error('Error starting server', error);
    } else {
      appLogger.error('Error starting server', new Error('Unknown error'));
    }
    await clientDatabase.disconnect();
    server.close();
    process.exit(1);
  }
};

void init();
