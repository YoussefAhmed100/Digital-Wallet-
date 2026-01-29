import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { DrizzleModule } from 'src/database/drizzle.module';

@Module({
  imports: [ DrizzleModule],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionsModule {}
