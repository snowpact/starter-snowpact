import { describe, it, expect } from 'vitest';

import { authRegisterSchema } from './schema';

describe('authRegisterSchema', () => {
  describe('body', () => {
    it('should validate a correct email and password', () => {
      const result = authRegisterSchema.body.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid email', () => {
      const result = authRegisterSchema.body.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject when email is missing', () => {
      const result = authRegisterSchema.body.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject when password is missing', () => {
      const result = authRegisterSchema.body.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });

    it('should reject when password is empty', () => {
      const result = authRegisterSchema.body.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });
  });
});
