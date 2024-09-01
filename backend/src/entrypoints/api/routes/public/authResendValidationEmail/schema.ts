import { z } from '@hono/zod-openapi';

export const authResendValidationEmailSchema = {
  body: z
    .object({
      email: z.string().email().optional(),
      token: z.string().optional(),
    })
    .refine((data) => data.email || data.token, {
      message: 'Either email or token must be provided',
      path: ['email', 'token'],
    }),
};
