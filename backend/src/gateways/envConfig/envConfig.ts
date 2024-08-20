import { injectable } from 'inversify';
import { z } from 'zod';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

import { parseNumber, parseBoolean } from '@/configuration/utils/zodParser';

@injectable()
export class EnvConfig implements EnvConfigInterface {
  readonly nodeEnv: string;
  readonly port: number;
  readonly logLevel: string;
  readonly dbName: string;
  readonly dbHost: string;
  readonly dbPort: number;
  readonly dbUser: string;
  readonly dbPassword: string;
  readonly dbUrl: string;
  readonly accessTokenSecret: string;
  readonly accessTokenExpiration: number;
  readonly refreshTokenSecret: string;
  readonly refreshTokenExpiration: number;
  readonly accountTokenSecret: string;
  readonly accountTokenExpiration: number;
  readonly smtpUrl: string;
  readonly fromEmail: string;
  readonly emailSend: boolean;
  readonly autoMigration: boolean;
  readonly logSql: boolean;

  constructor() {
    const config = this.buildConfig();
    this.nodeEnv = config.NODE_ENV;
    this.port = config.PORT;
    this.logLevel = config.LOG_LEVEL;
    this.dbName = config.DB_NAME;
    this.dbHost = config.DB_HOST;
    this.dbPort = config.DB_PORT;
    this.dbUser = config.DB_USER;
    this.dbPassword = config.DB_PASSWORD;
    this.dbUrl = `postgres://${this.dbUser}:${this.dbPassword}@${this.dbHost}:${this.dbPort}/${this.dbName}`;
    this.accessTokenSecret = config.ACCESS_TOKEN_SECRET;
    this.accessTokenExpiration = config.ACCESS_TOKEN_EXPIRATION;
    this.refreshTokenSecret = config.REFRESH_TOKEN_SECRET;
    this.refreshTokenExpiration = config.REFRESH_TOKEN_EXPIRATION;
    this.accountTokenSecret = config.ACCOUNT_TOKEN_SECRET;
    this.accountTokenExpiration = config.ACCOUNT_TOKEN_EXPIRATION;
    this.smtpUrl = config.SMTP_URL;
    this.fromEmail = config.FROM_EMAIL;
    this.emailSend = config.EMAIL_SEND;
    this.autoMigration = config.AUTO_MIGRATION;
    this.logSql = config.LOG_SQL;
  }

  private ConfigParser = z.object({
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
    AUTO_MIGRATION: parseBoolean(z.boolean()).default(false),
    LOG_SQL: parseBoolean(z.boolean()).default(false),
  });

  private buildConfig() {
    try {
      return this.ConfigParser.parse(process.env);
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Error while parsing env variables:', error);
      }
      throw error;
    }
  }
}
