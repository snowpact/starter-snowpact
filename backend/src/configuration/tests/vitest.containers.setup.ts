import 'reflect-metadata';

import { ServerType } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { vi, beforeAll, afterAll, afterEach, inject } from 'vitest';

import { ClientDatabaseInterface } from '@/gateways/helpers/database/clientDatabase/clientDatabase.interface';

import { CustomEnvInterface } from '@/entrypoints/api/loader/getHonoApp';
import { bootstrap } from '@/entrypoints/api/loader/server';

import { TestDbService } from './testDb.service';
import { mainContainer } from '../di/mainContainer';
import { TYPES } from '../di/types';

vi.mock('@/gateways/helpers/clientMailer/mailer', () => {
  return {
    sendMail: vi.fn().mockResolvedValue(true),
  };
});

export let testDbService: TestDbService;
export let app: OpenAPIHono<CustomEnvInterface>;
let server: ServerType;

beforeAll(async () => {
  const postgresUri = inject('postgresUri');
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  await clientDatabase.connect(postgresUri);
  testDbService = new TestDbService(clientDatabase.getDataSource());
  const bootstrapApp = bootstrap();
  server = bootstrapApp.server;
  app = bootstrapApp.app;
});

afterEach(async () => {
  await testDbService.clear();
});

afterAll(async () => {
  await testDbService.close();
  server.close();
});
