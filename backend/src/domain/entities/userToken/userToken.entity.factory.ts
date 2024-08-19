import { faker } from '@faker-js/faker';

import { buildFactory } from '@/utils/buildFactory';

import { UserTokenInterface, UserTokenTypeValues } from './userToken.entity.interface';

const buildSchema = (): UserTokenInterface => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    value: faker.string.uuid(),
    canBeRefreshed: faker.datatype.boolean(),
    tokenType: faker.helpers.arrayElement(UserTokenTypeValues),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    expirationDate: faker.date.future(),
  };
};

export const userTokenFactory = (args?: Partial<UserTokenInterface>): UserTokenInterface => {
  return buildFactory<UserTokenInterface>({
    ...buildSchema(),
  })(args);
};
