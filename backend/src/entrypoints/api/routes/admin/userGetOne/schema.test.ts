import { describe, it, expect } from 'vitest';

import { getUserSchema } from './schema';

describe('getUserSchema', () => {
  describe('params', () => {
    it('should validate a correct UUID', () => {
      const result = getUserSchema.params.safeParse({
        id: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid UUID', () => {
      const result = getUserSchema.params.safeParse({
        id: 'invalid-uuid',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('should reject when UUID is missing', () => {
      const result = getUserSchema.params.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });
  });
});
