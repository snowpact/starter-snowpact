import 'reflect-metadata';

import { ServerType } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { vi, beforeAll, afterAll, afterEach, inject } from 'vitest';

import { ClientDatabaseInterface } from '@/infrastructure/database/clientDatabase/clientDatabase.interface';

import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { bootstrap } from '@/infrastructure/http/server';

import { TestDbHelper } from './helpers/storage/testDb.helper';

vi.mock('@/infrastructure/services/mailService', () => {
  return {
    sendMail: vi.fn().mockResolvedValue(true),
  };
});

export let testDbHelper: TestDbHelper;
export let app: OpenAPIHono;
let server: ServerType;

beforeAll(async () => {
  const postgresUri = inject('postgresUri');
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  await clientDatabase.connect(postgresUri);
  testDbHelper = await TestDbHelper.setup();
  const bootstrapApp = bootstrap();
  server = bootstrapApp.server;
  app = bootstrapApp.app;
});

afterEach(async () => {
  await testDbHelper.clear();
});

afterAll(async () => {
  await testDbHelper.close();
  server.close();
});
