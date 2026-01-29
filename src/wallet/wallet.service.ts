import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,

} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import { DrizzleService } from '../database/drizzle.service';
import { wallets } from './schema/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    private readonly drizzle: DrizzleService) {}

  async create(userId: string, currency: string) {
    const existingWallet = await this.drizzle.connection.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (existingWallet) {
      throw new ConflictException('User already has a wallet');
    }

    const [wallet] = await this.drizzle.connection
      .insert(wallets)
      .values({
        userId,
        currency,
        balance: '0',
      })
      .returning();

    return wallet;
  }

  async findById(walletId: string) {
    const wallet = await this.drizzle.connection.query.wallets.findFirst({
      where: eq(wallets.id, walletId),
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async credit(walletId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const wallet = await this.findById(walletId);

    const newBalance = Number(wallet.balance) + amount;

    await this.drizzle.connection
      .update(wallets)
      .set({ balance: newBalance.toString() })
      .where(eq(wallets.id, walletId));

    return { walletId, balance: newBalance };
  }

  async debit(walletId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const wallet = await this.findById(walletId);

    const currentBalance = Number(wallet.balance);

    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const newBalance = currentBalance - amount;

    await this.drizzle.connection
      .update(wallets)
      .set({ balance: newBalance.toString() })
      .where(eq(wallets.id, walletId));

    return { walletId, balance: newBalance };
  }
}
