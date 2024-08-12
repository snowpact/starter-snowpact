import 'reflect-metadata';
import { defineConfig } from 'drizzle-kit';

import { envConfig } from '@/infrastructure/config/env';

export default defineConfig({
  schema: './src/gateways/database/schema/*',
  out: './src/gateways/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: envConfig.DB_NAME ?? '',
    host: envConfig.DB_HOST ?? '',
    user: envConfig.DB_USER ?? '',
    password: envConfig.DB_PASSWORD ?? '',
    ssl: false,
  },
});
