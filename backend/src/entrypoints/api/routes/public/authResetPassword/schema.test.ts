import { describe, it, expect } from 'vitest';

import { authResetPasswordBodySchema, authResetPasswordResponseSchema } from './schema';

describe('authResetPasswordSchema', () => {
  describe('body', () => {
    it('should validate a correct token and password', () => {
      const result = authResetPasswordBodySchema.safeParse({
        token: 'valid_token',
        password: 'newPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when token is missing', () => {
      const result = authResetPasswordBodySchema.safeParse({
        password: 'newPassword123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('token');
      }
    });

    it('should reject when password is missing', () => {
      const result = authResetPasswordBodySchema.safeParse({
        token: 'valid_token',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });
  });

  describe('response', () => {
    it('should validate a correct response', () => {
      const result = authResetPasswordResponseSchema.safeParse({
        message: 'Password reset successfully',
        code: 'PASSWORD_RESET_SUCCESSFULLY',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when message is missing', () => {
      const result = authResetPasswordResponseSchema.safeParse({
        code: 'PASSWORD_RESET_SUCCESSFULLY',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
      }
    });

    it('should reject when code is missing', () => {
      const result = authResetPasswordResponseSchema.safeParse({
        message: 'Password reset successfully',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('code');
      }
    });
  });
});
