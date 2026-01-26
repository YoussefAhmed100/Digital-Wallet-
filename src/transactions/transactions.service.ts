import { Inject, Injectable } from '@nestjs/common';
import { transactions } from './schema/transactions.schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/transactions.schema';
import { eq, and } from 'drizzle-orm';
import { ParsedTransaction } from '../banks/contracts/parsed-transaction.type';

export interface Transaction {
  id: string;
  reference: string;
  walletId?: string | null;
  amount: string;
  type: string;
  status: string;
  bank: string;
  transactionDate: Date;
  createdAt?: Date | null;
  rawPayload: unknown; 
}

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly drizzle: NodePgDatabase<typeof schema>,
  ) {}

  async upsertTransaction(transactionDto: ParsedTransaction): Promise<Transaction | undefined> {
    const existing = await this.findTransactionByReference(transactionDto.reference, transactionDto.bank);
    if (existing) return existing;

    const transactionType = transactionDto.amount >= 0 ? 'CREDIT' : 'DEBIT';

    const [newTransaction] = await this.drizzle
      .insert(transactions)
      .values({
        reference: transactionDto.reference,
        amount: transactionDto.amount.toString(),
        type: transactionType,
        status: 'SUCCESS',
        bank: transactionDto.bank,
        transactionDate: transactionDto.transactionDate,
        rawPayload: transactionDto.metadata, 
      })
      .returning();

    return newTransaction;
  }

  async findTransactionByReference(reference: string, bank: string): Promise<Transaction | undefined> {
    return (await this.drizzle
      .select()
      .from(transactions)
      .where(
          eq(transactions.reference, reference),
       
      
      )
      .limit(1))[0];
  }

  async processTransactionsBatch(bank: string, transactionsList: ParsedTransaction[]): Promise<Transaction[]> {
    const results: Transaction[] = [];
    for (const tx of transactionsList) {
      tx.bank = bank;
      const saved = await this.upsertTransaction(tx);
      if (saved) results.push(saved);
    }
    return results;
  }
}
