/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, beforeAll, it, expect } from 'vitest';

import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { tokenFactory } from '@/infrastructure/services/stateFullToken/token/token.factory';
import { testDbHelper } from '@/tests/vitest.containers.setup';

import { TokenRepositoryInterface } from './token.repository.interface';

describe('Token Repository', () => {
  let tokenRepository: TokenRepositoryInterface;
  beforeAll(() => {
    tokenRepository = mainContainer.get<TokenRepositoryInterface>(TYPES.TokenRepository);
  });
  describe('create', () => {
    it('should create a token', async () => {
      const token = tokenFactory();

      await tokenRepository.create(token);

      const storedToken = await testDbHelper.getToken(token.value);
      expect(storedToken).toEqual(token);
    });
  });

  describe('findByTokenValue', () => {
    it('should return a token by tokenValue', async () => {
      const token = tokenFactory();
      await testDbHelper.persistToken(token);

      const storedToken = await tokenRepository.findByTokenValue(token.value);
      expect(storedToken).toEqual(token);
    });
    it('should return undefined if tokenValue does not exist', async () => {
      const storedToken = await tokenRepository.findByTokenValue('not-existing-token');
      expect(storedToken).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a token by token value', async () => {
      const token = tokenFactory();
      await testDbHelper.persistToken(token);

      await tokenRepository.delete(token.value);

      const storedToken = await testDbHelper.getToken(token.value);
      expect(storedToken).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a token', async () => {
      const token = tokenFactory();
      await testDbHelper.persistToken(token);
      const newTokenValue = 'new-token-value';
      const newExpirationDate = faker.date.future();

      await tokenRepository.update({
        oldTokenValue: token.value,
        newTokenValue,
        expirationDate: newExpirationDate,
      });

      const storedToken = await testDbHelper.getToken(newTokenValue);

      expect(storedToken).toEqual({
        ...token,
        updatedAt: expect.any(Date),
        value: newTokenValue,
        expirationDate: newExpirationDate,
      });

      expect(storedToken?.updatedAt).not.toEqual(token.updatedAt);
    });
  });
});
