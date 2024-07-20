import 'reflect-metadata';
import { defineConfig } from 'drizzle-kit';

import { envConfig } from '../config/env';

export default defineConfig({
  schema: './src/infrastructure/database/schema/*',
  out: './src/infrastructure/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: envConfig.DB_NAME ?? '',
    host: envConfig.DB_HOST ?? '',
    user: envConfig.DB_USER ?? '',
    password: envConfig.DB_PASSWORD ?? '',
    ssl: false,
  },
});
