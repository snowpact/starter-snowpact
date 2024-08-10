import { describe, it, expect, beforeEach, vi } from 'vitest';

import { envConfig } from '@/infrastructure/config/env';

import { getStatelessTokenServiceMock } from '@/infrastructure/services/statelessToken/statelessToken.service.mock';

import { AuthService } from './authToken.service';

describe('AuthService', () => {
  const statelessTokenServiceMock = getStatelessTokenServiceMock();
  const authService = new AuthService(statelessTokenServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', async () => {
      const payload = { userId: '123' };
      const token = 'access-token';

      statelessTokenServiceMock.generateToken.mockResolvedValue(token);

      const result = await authService.generateAccessToken(payload);

      expect(result).toBe(token);
      expect(statelessTokenServiceMock.generateToken).toHaveBeenCalledWith({
        payload,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
        secret: envConfig.ACCESS_TOKEN_SECRET,
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', async () => {
      const payload = { userId: '123' };
      const token = 'refresh-token';

      statelessTokenServiceMock.generateToken.mockResolvedValue(token);

      const result = await authService.generateRefreshToken(payload);

      expect(result).toBe(token);
      expect(statelessTokenServiceMock.generateToken).toHaveBeenCalledWith({
        payload,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
        secret: envConfig.REFRESH_TOKEN_SECRET,
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

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', async () => {
      const token = 'refresh-token';
      const payload = { userId: '123' };

      statelessTokenServiceMock.verifyToken.mockResolvedValue(payload);

      const result = await authService.verifyRefreshToken(token);

      expect(result).toBe(payload);
      expect(statelessTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        token,
        secret: envConfig.REFRESH_TOKEN_SECRET,
        ignoreExpiration: false,
      });
    });
  });
});
