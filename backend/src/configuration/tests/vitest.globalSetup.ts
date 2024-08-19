import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import TestContainers from './testContainers';
import { mainContainer } from '../di/mainContainer';
import { TYPES } from '../di/types';

import type { GlobalSetupContext } from 'vitest/node';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProvidedContext {
    postgresUri: string;
  }
}

export async function setup({ provide }: GlobalSetupContext) {
  const testContainers = new TestContainers();
  await testContainers.start();

  const { postgresUri } = testContainers.getUris();
  provide('postgresUri', postgresUri);
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  await clientDatabase.connect(postgresUri);
  try {
    await clientDatabase.runMigrations();
  } finally {
    await clientDatabase.disconnect();
  }

  return async (): Promise<void> => {
    await testContainers.stop();
  };
}
