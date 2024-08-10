import { describe, expect, test } from 'vitest';

import { PublicUser, PublicUserLite, UserSerializer } from './user.serializer';
import { userFactory } from '../entities/user/user.factory';

describe('UserSerializer', () => {
  const user = userFactory({
    id: '1',
    email: 'john.doe@example.com',
    password: 'password123',
    admin: true,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
  });

  test('serializeLite should serialize a user to LiteUser format', () => {
    const expected: PublicUserLite = {
      email: 'john.doe@example.com',
      admin: true,
    };

    const result = UserSerializer.serializeLite(user);
    expect(result).toEqual(expected);
  });

  test('serialize should serialize a user to DetailedUser format', () => {
    const expected: PublicUser = {
      id: '1',
      email: 'john.doe@example.com',
      admin: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    };

    const result = UserSerializer.serialize(user);
    expect(result).toEqual(expected);
  });
});
