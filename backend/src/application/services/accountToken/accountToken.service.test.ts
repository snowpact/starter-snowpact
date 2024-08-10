import { describe, it, expect, beforeEach, vi } from 'vitest';

import { tokenFactory } from '@/infrastructure/services/stateFullToken/token/token.factory';

import { getStateFullTokenServiceMock } from '@/infrastructure/services/stateFullToken/stateFullToken.service.mock';

import { AccountTokenService } from './accountToken.service';
import { envConfig } from '../../../infrastructure/config/env';

describe('AccountTokenService', () => {
  const stateFullTokenServiceMock = getStateFullTokenServiceMock();
  const accountTokenService = new AccountTokenService(stateFullTokenServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccountToken', () => {
    it('should generate an account token', async () => {
      const token = tokenFactory({ canBeRefreshed: false });

      stateFullTokenServiceMock.generateToken.mockResolvedValue(token.value);

      const result = await accountTokenService.generateAccountToken({
        tokenType: token.tokenType,
        userId: token.userId,
      });

      expect(result).toBe(token.value);
      expect(stateFullTokenServiceMock.generateToken).toHaveBeenCalledWith({
        userId: token.userId,
        expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
        canBeRefreshed: token.canBeRefreshed,
        tokenType: token.tokenType,
      });
    });
  });

  describe('verifyAccountToken', () => {
    it('should verify an account token', async () => {
      const token = tokenFactory({ canBeRefreshed: false });

      stateFullTokenServiceMock.verifyToken.mockResolvedValue(token);

      const result = await accountTokenService.verifyAccountToken({
        tokenValue: token.value,
        tokenType: token.tokenType,
      });

      expect(result).toBe(token.userId);
      expect(stateFullTokenServiceMock.verifyToken).toHaveBeenCalledWith({
        tokenValue: token.value,
        tokenType: token.tokenType,
        ignoreExpiration: false,
      });
    });
  });

  describe('deleteAccountToken', () => {
    it('should delete an account token', async () => {
      const token = tokenFactory({ canBeRefreshed: false });

      await accountTokenService.deleteAccountToken(token.value);

      expect(stateFullTokenServiceMock.removeToken).toHaveBeenCalledWith(token.value);
    });
  });
});
