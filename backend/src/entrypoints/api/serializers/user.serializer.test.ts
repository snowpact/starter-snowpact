import { describe, it, expect } from 'vitest';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

import { UserSerializer, PublicUserLite, PublicUser } from './user.serializer';

describe('UserSerializer', () => {
  const mockUser: UserInterface = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    admin: false,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
    password: 'password',
  };

  describe('serializeLite', () => {
    it('should correctly serialize a valid user to PublicUserLite', () => {
      const result = UserSerializer.serializeLite(mockUser);
      const expected: PublicUserLite = {
        email: 'test@example.com',
        admin: false,
      };
      expect(result).toEqual(expected);
    });

    it('should throw an error when serializing an invalid user', () => {
      const invalidUser = { ...mockUser, email: 'invalid-email' };
      expect(() => UserSerializer.serializeLite(invalidUser)).toThrow();
    });
  });

  describe('serialize', () => {
    it('should correctly serialize a valid user to PublicUser', () => {
      const result = UserSerializer.serialize(mockUser);
      const expected: PublicUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        admin: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };
      expect(result).toEqual(expected);
    });

    it('should throw an error when serializing an invalid user', () => {
      const invalidUser = { ...mockUser, id: 'invalid-uuid' };
      expect(() => UserSerializer.serialize(invalidUser)).toThrow();
    });
  });
});
