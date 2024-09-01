import 'reflect-metadata';

import { ServerType } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { vi, beforeAll, afterAll, afterEach, inject } from 'vitest';

import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';
import { ClientQueueInterface } from '@/infrastructure/queue/clientQueue/clientQueue.interface';

import { CustomEnvInterface } from '@/entrypoints/api/loader/getHonoApp';
import { bootstrap } from '@/entrypoints/api/loader/server';

import { TestDbService } from './testDb.service';
import { TestQueueService } from './testQueue.service';
import { mainContainer } from '../di/mainContainer';
import { TYPES } from '../di/types';

vi.mock('@/infrastructure/clientMailer/mailer', () => {
  return {
    Mailer: vi.fn().mockImplementation(() => ({
      sendMail: vi.fn().mockResolvedValue(true),
    })),
  };
});

export let testDbService: TestDbService;
export let testQueueService: TestQueueService;
export let app: OpenAPIHono<CustomEnvInterface>;
let server: ServerType;

beforeAll(async () => {
  const postgresUri = inject('postgresUri');

  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  await clientDatabase.connect(postgresUri);

  const clientQueue = mainContainer.get<ClientQueueInterface>(TYPES.ClientQueue);
  await clientQueue.start(postgresUri);
  testQueueService = await TestQueueService.setup(postgresUri);

  testDbService = new TestDbService(clientDatabase.getDataSource());
  const bootstrapApp = bootstrap();
  server = bootstrapApp.server;
  app = bootstrapApp.app;
});

afterEach(async () => {
  await testDbService.clear();
  await testQueueService.clear();
});

afterAll(async () => {
  await testDbService.close();
  await testQueueService.close();
  server.close();
});
