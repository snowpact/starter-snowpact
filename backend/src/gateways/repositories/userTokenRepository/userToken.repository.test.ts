/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, beforeAll, it, expect } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { testDbService } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';
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
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });

      await userTokenRepository.create(token);

      const storedToken = await testDbService.getToken(token.value);
      expect(storedToken).toEqual(token);
    });
  });

  describe('findByTokenValue', () => {
    it('should return a token by tokenValue', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token);

      const storedToken = await userTokenRepository.findByTokenValue(token.value);
      expect(storedToken).toEqual(token);
    });
    it('should return undefined if tokenValue does not exist', async () => {
      const storedToken = await userTokenRepository.findByTokenValue('not-existing-token');
      expect(storedToken).toBeNull();
    });
  });

  describe('deleteByValue', () => {
    it('should delete a token by token value', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token);

      await userTokenRepository.deleteByValue(token.value);

      const storedToken = await testDbService.getToken(token.value);
      expect(storedToken).toBeNull();
    });
  });

  describe('deleteByUser', () => {
    it('should delete a token by user id', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token);
      const token2 = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token2);

      await userTokenRepository.deleteByUser(user.id);

      const storedToken = await testDbService.getToken(token.value);
      const storedToken2 = await testDbService.getToken(token.value);
      expect(storedToken).toBeNull();
      expect(storedToken2).toBeNull();
    });

    it('should delete a token by user id (except a token value)', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token);
      const token2 = userTokenFactory({ userId: user.id });
      await testDbService.persistToken(token2);

      await userTokenRepository.deleteByUser(user.id, { exceptTokenValue: token2.value });

      const storedToken = await testDbService.getToken(token.value);
      const storedToken2 = await testDbService.getToken(token2.value);
      expect(storedToken).toBeNull();
      expect(storedToken2).not.toBeNull();
    });

    it('should delete a token by user id (by token type)', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.resetPassword,
      });
      await testDbService.persistToken(token);
      const token2 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
      });
      await testDbService.persistToken(token2);

      await userTokenRepository.deleteByUser(user.id, {
        tokenType: UserTokenTypeEnum.resetPassword,
      });

      const storedToken = await testDbService.getToken(token.value);
      const storedToken2 = await testDbService.getToken(token2.value);
      expect(storedToken).toBeNull();
      expect(storedToken2).not.toBeNull();
    });
  });
  describe('deleteUserTokens', () => {
    it('should delete all tokens for a user with the given types', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token1 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.refreshToken,
      });
      const token2 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
      });
      const token3 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.resetPassword,
      });
      await testDbService.persistToken(token1);
      await testDbService.persistToken(token2);
      await testDbService.persistToken(token3);

      await userTokenRepository.deleteUserTokens(user.id, [
        UserTokenTypeEnum.refreshToken,
        UserTokenTypeEnum.resetPassword,
      ]);

      const storedToken1 = await testDbService.getTokensByUserId(user.id);
      expect(storedToken1).toEqual([token2]);
    });
    it('should delete all tokens for a user - no types provided', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token1 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.refreshToken,
      });
      const token2 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.accountValidation,
      });
      const token3 = userTokenFactory({
        userId: user.id,
        tokenType: UserTokenTypeEnum.resetPassword,
      });
      await testDbService.persistToken(token1);
      await testDbService.persistToken(token2);
      await testDbService.persistToken(token3);

      await userTokenRepository.deleteUserTokens(user.id, undefined);

      const storedTokens = await testDbService.getTokensByUserId(user.id);
      expect(storedTokens).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a token', async () => {
      const user = userFactory();
      await testDbService.persistUser(user);
      const token = userTokenFactory({ userId: user.id });
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
