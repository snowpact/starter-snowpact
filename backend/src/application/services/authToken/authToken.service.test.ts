import { describe, it, expect, beforeEach, vi } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';
import { EnvConfig } from '@/gateways/envConfig/envConfig';

import { AuthService } from './authToken.service';
import { getStatelessTokenServiceMock } from '../statelessToken/statelessToken.service.mock';
import { getUserTokenServiceMock } from '../userToken/userToken.service.mock';

describe('AuthService', () => {
  const statelessTokenServiceMock = getStatelessTokenServiceMock();
  const userTokenServiceMock = getUserTokenServiceMock();
  const envConfigMock = new EnvConfig();
  const authService = new AuthService(
    statelessTokenServiceMock,
    userTokenServiceMock,
    envConfigMock,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', async () => {
      const userId = '123';
      const token = 'access-token';

      statelessTokenServiceMock.generateToken.mockResolvedValue(token);

      const result = await authService.generateAccessToken(userId);

      expect(result).toBe(token);
      expect(statelessTokenServiceMock.generateToken).toHaveBeenCalledWith({
        payload: { userId },
        expiresIn: envConfigMock.accessTokenExpiration,
        secret: envConfigMock.accessTokenSecret,
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const userId = '123';
      const token = userTokenFactory();

      userTokenServiceMock.generateToken.mockReturnValue(token);

      const result = authService.generateRefreshToken(userId);

      expect(result).toBe(token);
      expect(userTokenServiceMock.generateToken).toHaveBeenCalledWith({
        userId,
        canBeRefreshed: true,
        tokenType: UserTokenTypeEnum.refreshToken,
        expiresIn: envConfigMock.refreshTokenExpiration,
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify an access token', async () => {
      const token = 'access-token';
      const payload = { userId: '123' };

      statelessTokenServiceMock.verifyToken.mockResolvedValue(payload);

      const result = await authService.verifyAccessToken(token);

      expect(result).toEqual(payload);
      expect(statelessTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        token,
        secret: envConfigMock.accessTokenSecret,
        ignoreExpiration: false,
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const token = userTokenFactory();

      userTokenServiceMock.verifyToken.mockReturnValue(token);

      const result = authService.verifyRefreshToken({
        token,
        tokenValue: token.value,
        userId: token.userId,
      });

      expect(result).toEqual(token);
      expect(userTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        token,
        tokenValue: token.value,
        tokenType: UserTokenTypeEnum.refreshToken,
        userId: token.userId,
      });
    });
  });
});
