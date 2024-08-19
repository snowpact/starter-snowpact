import { z } from 'zod';

import { UserInterface } from '@/domain/entities/user/user.entity.interface';

export const PublicUserLiteSchemaPaser = z.object({
  email: z.string().email(),
  admin: z.boolean(),
});

const PublicUserSchemaParser = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  admin: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PublicUserLite = z.infer<typeof PublicUserLiteSchemaPaser>;
export type PublicUser = z.infer<typeof PublicUserSchemaParser>;

export class UserSerializer {
  static serializeLite(user: UserInterface): PublicUserLite {
    const serializedUser = {
      email: user.email,
      admin: user.admin,
    };

    return PublicUserLiteSchemaPaser.parse(serializedUser);
  }

  static serialize(user: UserInterface): PublicUser {
    const serializedUser = {
      id: user.id,
      email: user.email,
      admin: user.admin,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return PublicUserSchemaParser.parse(serializedUser);
  }
}
