import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { WalletModule } from './wallet/wallet.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionsModule,DrizzleModule, WebhookModule, WalletModule, UsersModule,
  AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
