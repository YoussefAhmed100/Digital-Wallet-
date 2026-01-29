import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PayTechParser } from './parsers/paytech.parser';
import { AcmeParser } from './parsers/acme.parser';
import { BankParserFactory } from './parsers/parser.factory';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    PayTechParser,
    AcmeParser,
    BankParserFactory,
  ],
  exports: [WebhookService],
})
export class WebhookModule {}
