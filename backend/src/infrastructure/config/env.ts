import { z } from 'zod';

import { envConfigParser, parseBoolean, parseNumber } from '../utils/zodParser';

const Config = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: parseNumber(z.number()).default(8080),
  LOG_LEVEL: z.enum(['debug', 'info', 'warning', 'error']).default('info'),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: parseNumber(z.number()),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: parseNumber(z.number()).default(1800),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRATION: parseNumber(z.number()).default(604800),
  ACCOUNT_TOKEN_SECRET: z.string(),
  ACCOUNT_TOKEN_EXPIRATION: parseNumber(z.number()).default(1800),
  SMTP_URL: z.string(),
  FROM_EMAIL: z.string(),
  EMAIL_SEND: parseBoolean(z.boolean()).default(false),
});
export type Config = z.infer<typeof Config>;

export const buildConfig = (): Config => {
  return envConfigParser(Config);
};

export const envConfig = buildConfig();
