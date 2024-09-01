import { describe, it, expect } from 'vitest';

import { authValidateAccountSchema } from './schema';

describe('authValidateAccountSchema', () => {
  describe('body', () => {
    it('should validate a correct token', () => {
      const result = authValidateAccountSchema.body.safeParse({
        token: 'valid_token',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when token is missing', () => {
      const result = authValidateAccountSchema.body.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('token');
      }
    });

    it('should reject when token is empty', () => {
      const result = authValidateAccountSchema.body.safeParse({
        token: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('token');
      }
    });
  });
});
