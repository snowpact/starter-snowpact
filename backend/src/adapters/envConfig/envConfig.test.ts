import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { EnvConfig } from './envConfig';

describe('EnvConfig', () => {
  let envConfig: EnvConfig;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      NODE_ENV: 'test',
      PORT: '8080',
      LOG_LEVEL: 'info',
      DB_NAME: 'testdb',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_USER: 'testuser',
      DB_PASSWORD: 'testpassword',
      ACCESS_TOKEN_SECRET: 'access_secret',
      ACCESS_TOKEN_EXPIRATION: '1800',
      REFRESH_TOKEN_SECRET: 'refresh_secret',
      REFRESH_TOKEN_EXPIRATION: '604800',
      ACCOUNT_TOKEN_SECRET: 'account_secret',
      ACCOUNT_TOKEN_EXPIRATION: '1800',
      SMTP_URL: 'smtp://localhost:1025',
      FROM_EMAIL: 'test@example.com',
      EMAIL_SEND: 'true',
    };
    envConfig = new EnvConfig();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return correct NODE_ENV', () => {
    expect(envConfig.nodeEnv).toBe('test');
  });

  it('should return correct PORT', () => {
    expect(envConfig.port).toBe(8080);
  });

  it('should return correct LOG_LEVEL', () => {
    expect(envConfig.logLevel).toBe('info');
  });

  it('should return correct DB_NAME', () => {
    expect(envConfig.dbName).toBe('testdb');
  });

  it('should return correct DB_HOST', () => {
    expect(envConfig.dbHost).toBe('localhost');
  });

  it('should return correct DB_PORT', () => {
    expect(envConfig.dbPort).toBe(5432);
  });

  it('should return correct DB_USER', () => {
    expect(envConfig.dbUser).toBe('testuser');
  });

  it('should return correct DB_PASSWORD', () => {
    expect(envConfig.dbPassword).toBe('testpassword');
  });

  it('should return correct ACCESS_TOKEN_SECRET', () => {
    expect(envConfig.accessTokenSecret).toBe('access_secret');
  });

  it('should return correct ACCESS_TOKEN_EXPIRATION', () => {
    expect(envConfig.accessTokenExpiration).toBe(1800);
  });

  it('should return correct REFRESH_TOKEN_SECRET', () => {
    expect(envConfig.refreshTokenSecret).toBe('refresh_secret');
  });

  it('should return correct REFRESH_TOKEN_EXPIRATION', () => {
    expect(envConfig.refreshTokenExpiration).toBe(604800);
  });

  it('should return correct ACCOUNT_TOKEN_SECRET', () => {
    expect(envConfig.accountTokenSecret).toBe('account_secret');
  });

  it('should return correct ACCOUNT_TOKEN_EXPIRATION', () => {
    expect(envConfig.accountTokenExpiration).toBe(1800);
  });

  it('should return correct SMTP_URL', () => {
    expect(envConfig.smtpUrl).toBe('smtp://localhost:1025');
  });

  it('should return correct FROM_EMAIL', () => {
    expect(envConfig.fromEmail).toBe('test@example.com');
  });

  it('should return correct EMAIL_SEND', () => {
    expect(envConfig.emailSend).toBe(true);
  });

  it('should throw an error for invalid environment variables', () => {
    process.env.PORT = 'invalid';
    expect(() => new EnvConfig()).toThrow();
  });
});
