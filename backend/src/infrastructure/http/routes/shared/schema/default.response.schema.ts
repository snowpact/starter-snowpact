import { z } from '@hono/zod-openapi';

export const defaultResponseSchema = z
  .object({
    message: z.string(),
    code: z.string(),
  })
  .openapi('ErrorResponse');
