/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TokenTypeValues } from '@/core/entities/token/token.interface';

import { tokenFactory } from '@/core/entities/token/token.factory';
import { AppError } from '@/core/errors/app.error';

import { getTokenRepositoryMock } from '@/gateways/database/repositories/tokenRepository/token.repository.mock';

import { StateFullTokenService } from './stateFullToken.service';

describe('StateFullTokenService', () => {
  const tokenRepositoryMock = getTokenRepositoryMock();
  const stateFullTokenService = new StateFullTokenService(tokenRepositoryMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.create.mockResolvedValue(undefined);

      const generatedToken = await stateFullTokenService.generateToken({
        userId: token.userId,
        expiresIn: 1000,
        canBeRefreshed: token.canBeRefreshed,
        tokenType: token.tokenType,
      });

      expect(generatedToken).toBeDefined();
      expect(tokenRepositoryMock.create).toHaveBeenCalledWith({
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

  describe('removeToken', () => {
    it('should remove a token', async () => {
      const token = 'token';
      await stateFullTokenService.removeToken(token);
      expect(tokenRepositoryMock.delete).toHaveBeenCalledWith(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      const verifiedToken = await stateFullTokenService.verifyToken({
        tokenValue: token.value,
        tokenType: token.tokenType,
        userId: token.userId,
      });

      expect(verifiedToken).toBeDefined();
      expect(verifiedToken.value).toBe(token.value);
      expect(tokenRepositoryMock.findByTokenValue).toHaveBeenCalledWith(token.value);
    });
    it('should throw an error if token is not found', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(undefined);

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if token expired - ignoreExpiration = false', async () => {
      const token = tokenFactory();
      token.expirationDate = new Date(Date.now() - 1000);
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should throw an error if token type is different', async () => {
      const originalTokenType = faker.helpers.arrayElement(TokenTypeValues);
      const token = tokenFactory({ tokenType: originalTokenType });
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      const differentTokenType = faker.helpers.arrayElement(
        TokenTypeValues.filter((type) => type !== originalTokenType),
      );

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: differentTokenType,
          userId: token.userId,
        }),
      ).rejects.toThrow(AppError);

      expect(tokenRepositoryMock.findByTokenValue).toHaveBeenCalledWith(token.value);
    });
    it('should not throw an error if token expired - ignoreExpiration = true', async () => {
      const token = tokenFactory();
      token.expirationDate = new Date(Date.now() - 1000);
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
          ignoreExpiration: true,
        }),
      ).resolves.not.toThrow(AppError);
    });
    it('should throw an error if userId is not the same', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: 'differentUserId',
          ignoreExpiration: false,
        }),
      ).rejects.toThrow(AppError);
    });
    it('should not throw an error if userId not provided', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);

      await expect(
        stateFullTokenService.verifyToken({
          tokenValue: token.value,
          tokenType: token.tokenType,
        }),
      ).resolves.not.toThrow(AppError);
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token', async () => {
      const token = tokenFactory();
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(token);
      await stateFullTokenService.refreshToken({ tokenValue: token.value, expiresIn: 1000 });
      expect(tokenRepositoryMock.update).toHaveBeenCalled();
    });
    it('should throw an error if token is not found', async () => {
      const token = 'token';
      tokenRepositoryMock.findByTokenValue.mockResolvedValue(undefined);

      await expect(
        stateFullTokenService.refreshToken({ tokenValue: token, expiresIn: 1000 }),
      ).rejects.toThrow(AppError);
      expect(tokenRepositoryMock.update).not.toHaveBeenCalled();
    });
  });
});
