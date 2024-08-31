import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { buildFactory } from '@/configuration/utils/buildFactory';

import { UserInterface } from './user.entity.interface';

const buildSchema = (): UserInterface => {
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 10);

  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: hashedPassword,
    admin: faker.datatype.boolean(),
    emailVerified: faker.datatype.boolean(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    userTokens: [],
  };
};

export const userFactory = (args?: Partial<UserInterface>): UserInterface => {
  const providedData = {
    ...args,
  };

  if (args?.password) {
    providedData.password = bcrypt.hashSync(args.password, 10);
  }
  return buildFactory<UserInterface>({
    ...buildSchema(),
  })({
    ...providedData,
  });
};
