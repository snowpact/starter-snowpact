import { z } from '@hono/zod-openapi';

export const authResetPasswordBodySchema = z.object({
  token: z.string(),
  password: z.string(),
});

export const authResetPasswordResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('ResetPasswordResponse');
