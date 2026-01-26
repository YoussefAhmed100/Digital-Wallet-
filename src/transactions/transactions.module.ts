import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DrizzleModule } from 'src/database/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
