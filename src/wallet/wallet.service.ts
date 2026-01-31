import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,

} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import { DrizzleService } from '../database/drizzle.service';
import { wallets } from './schema/wallet.schema';
import { users } from 'src/users/schema/user.schema';

@Injectable()
export class WalletService {
  constructor(
    private readonly drizzle: DrizzleService) {}

  async create(userId: string, currency: string) {
    // Check if user exists
    const userExists = await this.checkIfUserExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
   
    //  @desc Check if user already has a wallet
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
  // @desc find all wallets
  async findAll() {
    return this.drizzle.connection.query.wallets.findMany();
  }

  // @desc cridit wallet
  async creditWallet(walletId: string, amount: number) {
    const wallet = await this.findById(walletId);
    const newBalance = (BigInt(wallet.balance) + BigInt(amount)).toString();

    const [updatedWallet] = await this.drizzle.connection 
      .update(wallets)
      .set({ balance: newBalance })
      .where(eq(wallets.id, walletId))
      .returning();
    return updatedWallet;
  }
  // @desc debit wallet
  async debitWallet(walletId: string, amount: number) {
    const wallet = await this.findById(walletId);
    if (BigInt(wallet.balance) < BigInt(amount)) {
      throw new BadRequestException('Insufficient funds');
    }
    const newBalance = (BigInt(wallet.balance) - BigInt(amount)).toString();
    const [updatedWallet] = await this.drizzle.connection
      .update(wallets)
      .set({ balance: newBalance })
      .where(eq(wallets.id, walletId))
      .returning();
    return updatedWallet;
  }
 


  // @desc find wallet by id
   async findById(walletId: string) {
    const wallet = await this.drizzle.connection.query.wallets.findFirst({
      where: eq(wallets.id, walletId),
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

   // @desc check if user exists
   private async checkIfUserExists(userId: string) {
    const existingUser = await this.drizzle.connection.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return existingUser;
  }
  }