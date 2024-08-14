import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import {
  UserTokenTypeValues,
  UserTokenInterface,
} from '@/domain/entities/userToken/userToken.entity.interface';

// Définir un enum PostgreSQL pour les types de token
export const tokenTypeEnum = pgEnum('token_type', UserTokenTypeValues);

export const tokens = pgTable(
  'tokens',
  {
    id: uuid('id').primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    value: varchar('value', { length: 255 }).notNull().unique(),
    canBeRefreshed: boolean('canBeRefreshed').notNull(),
    tokenType: tokenTypeEnum('tokenType').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    expirationDate: timestamp('expirationDate').notNull(),
  },
  (table) => {
    return {
      valueIdx: index('value_idx').on(table.value),
    };
  },
);

type TokenModel = typeof tokens.$inferSelect;

export const assertTokenType: UserTokenInterface extends TokenModel ? true : false = true;
export const assertTokenTypeReverse: TokenModel extends UserTokenInterface ? true : false = true;
