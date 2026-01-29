import { pgTable, uuid, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '../../users/schema/user.schema';

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  balance: numeric('balance', { precision: 15, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 10 }).default('USD'),
  createdAt: timestamp('created_at').defaultNow(),
});
