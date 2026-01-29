import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

import { wallets } from 'src/wallet/schema/wallet.schema';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),

  reference: varchar('reference', { length: 255 }).notNull().unique(),

  walletId: uuid('wallet_id')
    .notNull()
    .references(() => wallets.id, { onDelete: 'cascade' }),

  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),

  type: varchar('type', { length: 20 }).notNull(), //  credit || debit

  bank: varchar('bank', { length: 50 }).notNull(),

  transactionDate: timestamp('transaction_date').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  metadata: jsonb('metadata').notNull().default('{}'),
});
