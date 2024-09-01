import { describe, it, expect } from 'vitest';

import { authResendValidationEmailSchema } from './schema';

describe('authResendValidationEmailSchema', () => {
  describe('body', () => {
    it('should validate a correct email', () => {
      const result = authResendValidationEmailSchema.body.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should validate a correct token', () => {
      const result = authResendValidationEmailSchema.body.safeParse({
        token: 'valid_token',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when both email and token are missing', () => {
      const result = authResendValidationEmailSchema.body.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
        expect(result.error.issues[0].path).toContain('token');
      }
    });

    it('should reject an invalid email', () => {
      const result = authResendValidationEmailSchema.body.safeParse({
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });
  });
});
