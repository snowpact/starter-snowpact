import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TokenTypeEnum } from '@/core/entities/token/token.interface';

import { envConfig } from '@/infrastructure/config/env';

import { AuthService } from './authToken.service';
import { getStateFullTokenServiceMock } from '../stateFullToken/stateFullToken.service.mock';
import { getStatelessTokenServiceMock } from '../statelessToken/statelessToken.service.mock';

describe('AuthService', () => {
  const statelessTokenServiceMock = getStatelessTokenServiceMock();
  const stateFullTokenServiceMock = getStateFullTokenServiceMock();
  const authService = new AuthService(statelessTokenServiceMock, stateFullTokenServiceMock);

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
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
        secret: envConfig.ACCESS_TOKEN_SECRET,
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', async () => {
      const userId = '123';
      const token = 'refresh-token';

      stateFullTokenServiceMock.generateToken.mockResolvedValue(token);

      const result = await authService.generateRefreshToken(userId);

      expect(result).toBe(token);
      expect(stateFullTokenServiceMock.generateToken).toHaveBeenCalledWith({
        userId,
        canBeRefreshed: true,
        tokenType: TokenTypeEnum.refreshToken,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify an access token', async () => {
      const token = 'access-token';
      const payload = { userId: '123' };

      statelessTokenServiceMock.verifyToken.mockResolvedValue(payload);

      const result = await authService.verifyAccessToken(token);

      expect(result).toBe(payload);
      expect(statelessTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        token,
        secret: envConfig.ACCESS_TOKEN_SECRET,
        ignoreExpiration: false,
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token', async () => {
      const tokenValue = 'refresh-token';
      const newTokenValue = 'new-token';

      stateFullTokenServiceMock.refreshToken.mockResolvedValue(newTokenValue);

      const result = await authService.refreshToken(tokenValue);

      expect(result).toBe(newTokenValue);
      expect(stateFullTokenServiceMock.refreshToken).toHaveBeenCalledWith({
        tokenValue,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
      });
    });
  });
});