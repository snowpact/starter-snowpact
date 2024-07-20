import { z } from '@hono/zod-openapi';

export const getProductParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getProductResponseSchema = z
  .object({
    id: z.string(),
  })
  .openapi('GetProductResponse');
