/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserTokenTypeValues } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { getUserTokenRepositoryMock } from '@/gateways/repositories/userTokenRepository/userToken.repository.mock';

import { UserTokenService } from './userToken.service';

describe('UserTokenService', () => {
  const userTokenRepositoryMock = getUserTokenRepositoryMock();
  const userTokenService = new UserTokenService(userTokenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.create.mockResolvedValue(undefined);

      const generatedToken = await userTokenService.generateToken({
        userId: token.userId,
        expiresIn: 1000,
        canBeRefreshed: token.canBeRefreshed,
        tokenType: token.tokenType,
      });

      expect(generatedToken).toBeDefined();
      expect(userTokenRepositoryMock.create).toHaveBeenCalledWith({
        id: expect.any(String),
        userId: token.userId,
        value: expect.any(String),
        canBeRefreshed: token.canBeRefreshed,
        tokenType: token.tokenType,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        expirationDate: expect.any(Date),
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      const verifiedToken = await userTokenService.verifyToken({
        tokenValue: token.value,
        tokenType: token.tokenType,
        userId: token.userId,
      });

      expect(verifiedToken).toBeDefined();
      expect(verifiedToken.value).toBe(token.value);
      expect(userTokenRepositoryMock.findByTokenValue).toHaveBeenCalledWith(token.value);
    });
    it('should throw an error if token is not found', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(null);

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if token expired - ignoreExpiration = false', async () => {
      const token = userTokenFactory();
      token.expirationDate = new Date(Date.now() - 1000);
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if token type is different', async () => {
      const originalTokenType = faker.helpers.arrayElement(UserTokenTypeValues);
      const token = userTokenFactory({ tokenType: originalTokenType });
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      const differentTokenType = faker.helpers.arrayElement(
        UserTokenTypeValues.filter((type) => type !== originalTokenType),
      );

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: differentTokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);

      expect(userTokenRepositoryMock.findByTokenValue).toHaveBeenCalledWith(token.value);
    });
    it('should not throw an error if token expired - ignoreExpiration = true', async () => {
      const token = userTokenFactory();
      token.expirationDate = new Date(Date.now() - 1000);
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
          ignoreExpiration: true,
        }),
      ).resolves.not.toThrow(AppError);
    });
    it('should throw an error if userId is not the same', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: 'differentUserId',
          ignoreExpiration: false,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should not throw an error if userId not provided', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        userTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
        }),
      ).resolves.not.toThrow(AppError);
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token', async () => {
      const token = userTokenFactory();
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(token);
      await userTokenService.refreshToken({ tokenValue: token.value, expiresIn: 1000 });
      expect(userTokenRepositoryMock.update).toHaveBeenCalled();
    });
    it('should throw an error if token is not found', async () => {
      const token = 'token';
      userTokenRepositoryMock.findByTokenValue.mockResolvedValue(null);

      await expect(
        userTokenService.refreshToken({ tokenValue: token, expiresIn: 1000 }),
      ).rejects.toThrow(AppError);
      expect(userTokenRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
