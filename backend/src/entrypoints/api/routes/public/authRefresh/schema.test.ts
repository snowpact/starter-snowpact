import { describe, it, expect } from 'vitest';

import { authRefreshSchema } from './schema';

describe('authRefreshSchema', () => {
  describe('body', () => {
    it('should validate a correct accessToken and refreshToken', () => {
      const result = authRefreshSchema.body.safeParse({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when accessToken is missing', () => {
      const result = authRefreshSchema.body.safeParse({
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('accessToken');
      }
    });

    it('should reject when refreshToken is missing', () => {
      const result = authRefreshSchema.body.safeParse({
        accessToken: 'access_token_123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('refreshToken');
      }
    });
  });

  describe('response', () => {
    it('should validate a correct response', () => {
      const result = authRefreshSchema.response.safeParse({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when accessToken is missing', () => {
      const result = authRefreshSchema.response.safeParse({
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('accessToken');
      }
    });

    it('should reject when refreshToken is missing', () => {
      const result = authRefreshSchema.response.safeParse({
        accessToken: 'access_token_123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('refreshToken');
      }
    });
  });
});
