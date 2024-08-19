import { describe, it, expect } from 'vitest';

import { authResetPasswordRequestSchema } from './schema';

describe('authResetPasswordRequestSchema', () => {
  describe('body', () => {
    it('should validate a correct email', () => {
      const result = authResetPasswordRequestSchema.body.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid email', () => {
      const result = authResetPasswordRequestSchema.body.safeParse({
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject when email is missing', () => {
      const result = authResetPasswordRequestSchema.body.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });
  });
});
