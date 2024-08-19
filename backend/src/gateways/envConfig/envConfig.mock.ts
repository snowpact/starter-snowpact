import { faker } from '@faker-js/faker';
import { Mocked } from 'vitest';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';

export const getEnvConfigMock = (): Mocked<EnvConfigInterface> => {
  const dbUser = faker.internet.userName();
  const dbPassword = faker.internet.password();
  const dbHost = faker.internet.ip();
  const dbPort = faker.number.int({ min: 1, max: 65535 });
  const dbName = 'postgres';
  const dbUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
  return {
    nodeEnv: faker.helpers.arrayElement(['development', 'production', 'test']),
    port: faker.internet.port(),
    logLevel: faker.helpers.arrayElement(['debug', 'info', 'warning', 'error']),
    dbName,
    dbHost,
    dbPort,
    dbUser,
    dbPassword,
    dbUrl,
    accessTokenSecret: faker.string.alphanumeric(32),
    accessTokenExpiration: faker.number.int({ min: 300, max: 3600 }),
    refreshTokenSecret: faker.string.alphanumeric(32),
    refreshTokenExpiration: faker.number.int({ min: 86400, max: 604800 }),
    accountTokenSecret: faker.string.alphanumeric(32),
    accountTokenExpiration: faker.number.int({ min: 300, max: 3600 }),
    smtpUrl: `smtp://${faker.internet.ip()}:${faker.number.int({ min: 1, max: 65535 })}`,
    fromEmail: faker.internet.email(),
    emailSend: faker.datatype.boolean(),
  };
};
