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
    const dbUrl = `postgres://${envConfig.dbUser}:${envConfig.dbPassword}@${envConfig.dbHost}:${envConfig.dbPort}/${envConfig.dbName}`;
    await clientDatabase.connect(dbUrl);
    const bootstrapData = bootstrap();
    server = bootstrapData.server;
  } catch (error) {
    if (error instanceof Error) {
      appLogger.error('Error starting server', error);
    } else {
      appLogger.error('Error starting server', new Error('Unknown error'));
    }
    await clientDatabase.getClient().end();
    server.close();
    process.exit(1);
  }
};

void init();
