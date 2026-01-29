import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) {}

 
  @Post()
  createWallet(
    @Body('userId') userId: string,
    @Body('currency') currency: string,
  ) {
    return this.walletService.create(userId, currency);
  }

 
  @Get(':id')
  getWallet(@Param('id') walletId: string) {
    return this.walletService.findById(walletId);
  }

 
  @Post(':id/credit')
  credit(
    @Param('id') walletId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.credit(walletId, amount);
  }

  
  @Post(':id/debit')
  debit(
    @Param('id') walletId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.debit(walletId, amount);
  }
}
