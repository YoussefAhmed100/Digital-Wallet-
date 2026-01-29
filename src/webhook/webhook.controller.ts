import { Controller, Post, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':bank/:walletId')
  async handleWebhook(
    @Param('bank') bank: string,
    @Param('walletId') walletId: string,
    @Body() body: string,
  ) {
    
    return this.webhookService.process(bank, walletId, body);
  }
}