import { pgTable, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core';

import { UserInterface } from '../../../application/entities/user/user.entity.interface';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  admin: boolean('admin').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

type UserModel = typeof users.$inferSelect;

export const assertUserType: UserInterface extends UserModel ? true : false = true;
export const assertUserTypeReverse: UserModel extends UserInterface ? true : false = true;
