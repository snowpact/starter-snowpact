import TestContainers from './testContainers';

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

  return async (): Promise<void> => {
    await testContainers.stop();
  };
}
