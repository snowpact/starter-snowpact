import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AccountTokenService } from './accountToken.service';
import { AccountTokenType } from './accountToken.service.interface';
import { envConfig } from '../../../infrastructure/config/env';
import { getStatelessTokenServiceMock } from '../../../infrastructure/services/statelessToken/statelessToken.service.mock';

describe('AccountTokenService', () => {
  const statelessTokenServiceMock = getStatelessTokenServiceMock();
  const accountTokenService = new AccountTokenService(statelessTokenServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccountToken', () => {
    it('should generate an account token', async () => {
      const userPayload = { userId: '123', type: AccountTokenType.VERIFY_ACCOUNT };
      const token = 'account-token';

      statelessTokenServiceMock.generateToken.mockResolvedValue(token);

      const result = await accountTokenService.generateAccountToken(userPayload);

      expect(result).toBe(token);
      expect(statelessTokenServiceMock.generateToken).toHaveBeenCalledWith({
        payload: userPayload,
        expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
        secret: envConfig.ACCOUNT_TOKEN_SECRET,
      });
    });
  });

  describe('verifyAccountToken', () => {
    it('should verify an account token', async () => {
      const token = 'account-token';
      const userPayload = { userId: '123' };

      statelessTokenServiceMock.verifyToken.mockResolvedValue(userPayload);

      const result = await accountTokenService.verifyAccountToken(token);

      expect(result).toBe(userPayload);
      expect(statelessTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        token,
        secret: envConfig.ACCOUNT_TOKEN_SECRET,
        ignoreExpiration: false,
      });
    });
  });
});
