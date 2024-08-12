import { describe, it, expect } from 'vitest';

import { authLoginSchema } from './schema';

describe('authLoginSchema', () => {
  describe('body', () => {
    it('should validate a correct email and password', () => {
      const result = authLoginSchema.body.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid email', () => {
      const result = authLoginSchema.body.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject when email is missing', () => {
      const result = authLoginSchema.body.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject when password is missing', () => {
      const result = authLoginSchema.body.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });

    it('should reject when password is empty', () => {
      const result = authLoginSchema.body.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });
  });

  describe('response', () => {
    it('should validate a correct response', () => {
      const result = authLoginSchema.response.safeParse({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when accessToken is missing', () => {
      const result = authLoginSchema.response.safeParse({
        refreshToken: 'refresh_token_456',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('accessToken');
      }
    });

    it('should reject when refreshToken is missing', () => {
      const result = authLoginSchema.response.safeParse({
        accessToken: 'access_token_123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('refreshToken');
      }
    });
  });
});
