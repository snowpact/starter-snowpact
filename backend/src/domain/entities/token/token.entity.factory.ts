import { faker } from '@faker-js/faker';

import { buildFactory } from '@/utils/buildFactory';

import { TokenInterface, TokenTypeValues } from './token.entity.interface';

const buildSchema = (): TokenInterface => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    value: faker.string.uuid(),
    canBeRefreshed: faker.datatype.boolean(),
    tokenType: faker.helpers.arrayElement(TokenTypeValues),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    expirationDate: faker.date.future(),
  };
};

export const tokenFactory = (args?: Partial<TokenInterface>): TokenInterface => {
  return buildFactory<TokenInterface>({
    ...buildSchema(),
  })(args);
};
