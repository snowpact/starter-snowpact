/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserTokenTypeValues } from '@/domain/entities/userToken/userToken.entity.interface';

import { AppError } from '@/application/errors/app.error';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

import { UserTokenService } from './userToken.service';

describe('UserTokenService', () => {
  const userTokenService = new UserTokenService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = userTokenFactory();

      const generatedToken = userTokenService.generateToken({
        userId: token.userId,
        expiresIn: 1000,
        canBeRefreshed: token.canBeRefreshed,
        tokenType: token.tokenType,
      });

      expect(generatedToken).toMatchObject({
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
    it('should verify a token', () => {
      const token = userTokenFactory();

      const verifiedToken = userTokenService.verifyToken({
        token,
        tokenValue: token.value,
        tokenType: token.tokenType,
        userId: token.userId,
      });

      expect(verifiedToken).toMatchObject(token);
    });
    it('should throw an error if token is not found', () => {
      const token = userTokenFactory();

      expect(() =>
        userTokenService.verifyToken({
          token: null,
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).toThrow(AppError);
    });
    it('should throw an error if token expired - ignoreExpiration = false', () => {
      const token = userTokenFactory({ expirationDate: new Date(Date.now() - 1000) });

      expect(() =>
        userTokenService.verifyToken({
          token,
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
        }),
      ).toThrow(AppError);
    });
    it('should throw an error if token type is different', () => {
      const originalTokenType = faker.helpers.arrayElement(UserTokenTypeValues);
      const token = userTokenFactory({ tokenType: originalTokenType });

      const differentTokenType = faker.helpers.arrayElement(
        UserTokenTypeValues.filter((type) => type !== originalTokenType),
      );

      expect(() =>
        userTokenService.verifyToken({
          token,
          tokenValue: token.value,
          tokenType: differentTokenType,
          userId: token.userId,
        }),
      ).toThrow(AppError);
    });
    it('should not throw an error if token expired - ignoreExpiration = true', () => {
      const token = userTokenFactory({ expirationDate: new Date(Date.now() - 1000) });

      expect(() =>
        userTokenService.verifyToken({
          token,
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: token.userId,
          ignoreExpiration: true,
        }),
      ).not.toThrow(AppError);
    });
    it('should throw an error if userId is not the same', () => {
      const token = userTokenFactory();

      expect(() =>
        userTokenService.verifyToken({
          token,
          tokenValue: token.value,
          tokenType: token.tokenType,
          userId: 'differentUserId',
          ignoreExpiration: false,
        }),
      ).toThrow(AppError);
    });
    it('should not throw an error if userId not provided', () => {
      const token = userTokenFactory();

      expect(() =>
        userTokenService.verifyToken({
          token,
          tokenValue: token.value,
          tokenType: token.tokenType,
        }),
      ).not.toThrow(AppError);
    });
  });
});
