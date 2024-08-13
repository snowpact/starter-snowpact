import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { TokenTypeValues, TokenInterface } from '@/domain/entities/token/token.entity.interface';

// Définir un enum PostgreSQL pour les types de token
export const tokenTypeEnum = pgEnum('token_type', TokenTypeValues);

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

export const assertTokenType: TokenInterface extends TokenModel ? true : false = true;
export const assertTokenTypeReverse: TokenModel extends TokenInterface ? true : false = true;
