import 'reflect-metadata';
import { defineConfig } from 'drizzle-kit';

import { envConfig } from '@/configuration/env/envConfig.singleton';

export default defineConfig({
  schema: './src/gateways/database/schema/*',
  out: './src/gateways/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: envConfig.dbName ?? '',
    host: envConfig.dbHost ?? '',
    user: envConfig.dbUser ?? '',
    password: envConfig.dbPassword ?? '',
    ssl: false,
  },
});
