import { Controller, Post, Param, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':bank')
  async receiveWebhook(
    @Param('bank') bank: string,
    @Body() body: string,
  ) {
    const bankName = bank.toUpperCase();

    const result = await this.webhookService.handleIncomingWebhook(body, bankName);

    return {
      success: true,
      processedCount: result.length,
      transactions: result,
    };
  }
}
