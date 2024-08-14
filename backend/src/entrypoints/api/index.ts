import 'reflect-metadata';
import { ServerType } from '@hono/node-server';

import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { envConfig } from '@/configuration/env/envConfig';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { Logger } from '@/gateways/logger/logger';

import { bootstrap } from './loader/server';

let clientDatabase: ClientDatabaseInterface;
let server: ServerType;

const init = async () => {
  try {
    clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
    const dbUrl = `postgres://${envConfig.DB_USER}:${envConfig.DB_PASSWORD}@${envConfig.DB_HOST}:${envConfig.DB_PORT}/${envConfig.DB_NAME}`;
    await clientDatabase.connect(dbUrl);
    const bootstrapData = bootstrap();
    server = bootstrapData.server;
  } catch (error) {
    const logger = new Logger();
    if (error instanceof Error) {
      logger.error('Error starting server', error);
    } else {
      logger.error('Error starting server', new Error('Unknown error'));
    }
    await clientDatabase.getClient().end();
    server.close();
    process.exit(1);
  }
};

void init();
