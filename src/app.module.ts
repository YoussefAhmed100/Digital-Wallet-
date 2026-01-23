import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { WebhooksModule } from './webhooks/webhooks.module';


@Module({
  imports: [TransactionsModule, WebhooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
