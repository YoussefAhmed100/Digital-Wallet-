import { pgTable, uuid, text, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: text('reference').notNull().unique(),
  walletId: uuid('wallet_id'),
  amount: numeric('amount').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  bank: text('bank').notNull(),
  transactionDate: timestamp('transaction_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  rawPayload: jsonb('raw_payload').notNull(),
});
