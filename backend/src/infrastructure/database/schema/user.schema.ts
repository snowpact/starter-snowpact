import { pgTable, timestamp, uuid, varchar, boolean, index } from 'drizzle-orm/pg-core';

import { UserInterface } from '../../../application/entities/user/user.entity.interface';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    admin: boolean('admin').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
    };
  },
);

type UserModel = typeof users.$inferSelect;

export const assertUserType: UserInterface extends UserModel ? true : false = true;
export const assertUserTypeReverse: UserModel extends UserInterface ? true : false = true;
