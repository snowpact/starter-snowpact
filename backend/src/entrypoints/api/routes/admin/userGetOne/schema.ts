import { z } from '@hono/zod-openapi';

import { PublicUserLiteSchemaPaser } from '@/entrypoints/api/serializers/user.serializer';

export const getUserSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: PublicUserLiteSchemaPaser,
};
