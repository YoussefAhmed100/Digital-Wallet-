import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { transactions } from './schema/transactions.schema';
import { wallets } from 'src/wallet/schema/wallet.schema';
import { eq, sql } from 'drizzle-orm';

export interface CreateTransactionDTO {
  walletId: string;
  reference: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  bank: string;
  transactionDate: Date;
  metadata?: Record<string, any>;
}

export interface TransactionResult {
  duplicate: boolean;
  transaction?: any;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly drizzleService: DrizzleService) {}

  
  async createTransactionIdempotent(data: CreateTransactionDTO): Promise<TransactionResult> {
    //@desc=> Check for duplicate
    const existingTransaction = await this.findTransactionByReference(data.reference);
    if (existingTransaction) {
      this.logger.log(`Transaction ${data.reference} already exists - skipping`);
      return { duplicate: true, transaction: existingTransaction };
    }

    const wallet = await this.validateWallet(data.walletId, data.type, data.amount);

    //@desc=> Create transaction and update balance
    const newTransaction = await this.executeTransactionWithBalanceUpdate(data, wallet);

    this.logger.log(`Transaction ${data.reference} created successfully`);
    return { duplicate: false, transaction: newTransaction };
  }

  async createTransaction(data: CreateTransactionDTO & { status?: string }) {
    const existingTransaction = await this.findTransactionByReference(data.reference);
    if (existingTransaction) {
      throw new ConflictException(`Transaction with reference ${data.reference} already exists`);
    }

    const wallet = await this.validateWallet(data.walletId, data.type, data.amount);
    return await this.executeTransactionWithBalanceUpdate(data, wallet);
  }

  
  async getTransactionsByWallet(walletId: string) {
    return await this.drizzleService.connection
      .select()
      .from(transactions)
      .where(eq(transactions.walletId, walletId))
      .execute();
  }

  
  async getWalletBalance(walletId: string) {
    const wallet = await this.findWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException(`Wallet ${walletId} not found`);
    }

    return {
      walletId: wallet.id,
      balance: Number(wallet.balance),
    };
  }


  private async findTransactionByReference(reference: string) {
    const [transaction] = await this.drizzleService.connection
      .select()
      .from(transactions)
      .where(eq(transactions.reference, reference))
      .limit(1)
      .execute();

    return transaction || null;
  }

 
  private async findWalletById(walletId: string) {
    const [wallet] = await this.drizzleService.connection
      .select()
      .from(wallets)
      .where(eq(wallets.id, walletId))
      .limit(1)
      .execute();

    return wallet || null;
  }

 
  private async validateWallet(walletId: string, type: 'CREDIT' | 'DEBIT', amount: number) {
    const wallet = await this.findWalletById(walletId);

    if (!wallet) {
      throw new NotFoundException(`Wallet ${walletId} not found`);
    }

    if (type === 'DEBIT') {
      const currentBalance = Number(wallet.balance);
      if (currentBalance < amount) {
        throw new BadRequestException(
          `Insufficient balance. Required: ${amount}, Available: ${currentBalance}`
        );
      }
    }

    return wallet;
  }


  private async executeTransactionWithBalanceUpdate(data: CreateTransactionDTO, wallet: any) {
    return await this.drizzleService.connection.transaction(async (tx) => {
     
      const newTransaction = await this.insertTransaction(tx, data);

      // Update wallet balance
      await this.updateWalletBalance(tx, data.walletId, data.amount, data.type, wallet.balance);

      return newTransaction;
    });
  }


  private async insertTransaction(tx: any, data: CreateTransactionDTO) {
    const [newTransaction] = await tx
      .insert(transactions)
      .values({
        reference: data.reference,
        walletId: data.walletId,
        amount: data.amount.toFixed(2),
        type: data.type,
        bank: data.bank,
        transactionDate: data.transactionDate,
        metadata: data.metadata || {},
        createdAt: new Date(),
      })
      .returning();

    return newTransaction;
  }


  private async updateWalletBalance(
    tx: any,
    walletId: string,
    amount: number,
    type: 'CREDIT' | 'DEBIT',
    oldBalance: string
  ) {
    const operation = type === 'CREDIT' ? '+' : '-';
    const [updatedWallet] = await tx
      .update(wallets)
      .set({
        balance: sql`CAST(${wallets.balance} AS NUMERIC(15,2)) ${sql.raw(operation)} ${amount}`
      })
      .where(eq(wallets.id, walletId))
      .returning();

    this.logger.log(
      `${type}: Wallet ${walletId} | Old: ${oldBalance} | ${type === 'CREDIT' ? 'Added' : 'Deducted'}: ${amount} | New: ${updatedWallet.balance}`
    );

    return updatedWallet;
  }
}