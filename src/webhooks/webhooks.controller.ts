import { Controller, Post, Body } from '@nestjs/common';
import { AcmeParser } from 'src/banks/acme/acme.parser';

import { PayTechParser } from 'src/banks/paytech/paytech.parser';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly payTechParser: PayTechParser
    ,private readonly acmeParser: AcmeParser
  ) {}

  @Post('paytech')
  PayTech_Webhook(@Body() body: string) {
    const transactions = this.payTechParser.parseData(body);
    return {
      count: transactions.length,
      transactions,
    };
  }
    @Post('acme')
  Acme_Webhook(@Body() body: string) {
    const transactions = this.acmeParser.parseData(body);
    return {
      count: transactions.length,
      transactions,
    };
  }


 
}
