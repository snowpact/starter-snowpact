import { z } from '@hono/zod-openapi';

export const resetPasswordBodySchema = z.object({
  token: z.string(),
  password: z.string(),
});

export const resetPasswordResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('ResetPasswordResponse');
