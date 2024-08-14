/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, beforeAll, it, expect } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { testDbService } from '@/configuration/tests/vitest.containers.setup';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { UserTokenRepositoryInterface } from '../../../domain/interfaces/repositories/userToken.repository.interface';

describe('UserToken Repository', () => {
  let userTokenRepository: UserTokenRepositoryInterface;
  beforeAll(() => {
    userTokenRepository = mainContainer.get<UserTokenRepositoryInterface>(
      TYPES.UserTokenRepository,
    );
  });
  describe('create', () => {
    it('should create a token', async () => {
      const token = userTokenFactory();

      await userTokenRepository.create(token);

      const storedToken = await testDbService.getToken(token.value);
      expect(storedToken).toEqual(token);
    });
  });

  describe('findByTokenValue', () => {
    it('should return a token by tokenValue', async () => {
      const token = userTokenFactory();
      await testDbService.persistToken(token);

      const storedToken = await userTokenRepository.findByTokenValue(token.value);
      expect(storedToken).toEqual(token);
    });
    it('should return undefined if tokenValue does not exist', async () => {
      const storedToken = await userTokenRepository.findByTokenValue('not-existing-token');
      expect(storedToken).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a token by token value', async () => {
      const token = userTokenFactory();
      await testDbService.persistToken(token);

      await userTokenRepository.delete(token.value);

      const storedToken = await testDbService.getToken(token.value);
      expect(storedToken).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a token', async () => {
      const token = userTokenFactory();
      await testDbService.persistToken(token);
      const newTokenValue = 'new-token-value';
      const newExpirationDate = faker.date.future();

      await userTokenRepository.update({
        oldTokenValue: token.value,
        newTokenValue,
        expirationDate: newExpirationDate,
      });

      const storedToken = await testDbService.getToken(newTokenValue);

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
