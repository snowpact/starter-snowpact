import 'reflect-metadata';

import { ServerType } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { vi, beforeAll, afterAll, afterEach, inject } from 'vitest';

import { ClientDatabaseInterface } from '@/gateways/database/clientDatabase/clientDatabase.interface';

import { bootstrap } from '@/entrypoints/api/loader/server';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

import { TestDbService } from './testDb.service';

vi.mock('@/infrastructure/services/mailService', () => {
  return {
    sendMail: vi.fn().mockResolvedValue(true),
  };
});

export let testDbService: TestDbService;
export let app: OpenAPIHono;
let server: ServerType;

beforeAll(async () => {
  const postgresUri = inject('postgresUri');
  const clientDatabase = mainContainer.get<ClientDatabaseInterface>(TYPES.ClientDatabase);
  await clientDatabase.connect(postgresUri);
  testDbService = await TestDbService.setup();
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
