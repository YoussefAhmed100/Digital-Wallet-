import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';


@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionsModule,DrizzleModule, WebhookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
