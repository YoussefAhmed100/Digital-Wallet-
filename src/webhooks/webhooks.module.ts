import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { PayTechParser } from 'src/banks/paytech/paytech.parser';
import { AcmeParser } from 'src/banks/acme/acme.parser';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService,PayTechParser,AcmeParser],
})
export class WebhooksModule {}
