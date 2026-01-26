// webhook.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PayTechParser } from '../banks/paytech/paytech.parser';
import { AcmeParser } from '../banks/acme/acme.parser';
import { TransactionsService } from '../transactions/transactions.service';
import { ParsedTransaction } from '../banks/contracts/parsed-transaction.type';

@Injectable()
export class WebhookService {
  private parsers = {
    PAYTECH: new PayTechParser(),
    ACME: new AcmeParser(),
  };

  constructor(private readonly transactionsService: TransactionsService) {}

  private detectBank(payload: string, bankNameHeader?: string): 'PAYTECH' | 'ACME' {
    if (bankNameHeader && (bankNameHeader.toUpperCase() === 'PAYTECH' || bankNameHeader.toUpperCase() === 'ACME')) {
      return bankNameHeader.toUpperCase() as 'PAYTECH' | 'ACME';
    }

    // لو مش موجود هنجرب نكتشف بالـ pattern في النص
    if (payload.includes('#')) return 'PAYTECH';
    if (payload.includes('//')) return 'ACME';

    throw new BadRequestException('Unable to detect bank from payload');
  }

  async handleIncomingWebhook(payload: string, bankNameHeader?: string) {
    const bank = this.detectBank(payload, bankNameHeader);
    const parser = this.parsers[bank];
    if (!parser) {
      throw new BadRequestException(`Parser for bank ${bank} not found`);
    }

    const parsedTransactions: ParsedTransaction[] = parser.parse(payload);

    // أضف اسم البنك لكل معاملة (لو مش مضاف)
    parsedTransactions.forEach(tx => {
      tx.bank = bank;
    });

    // خزن المعاملات في قاعدة البيانات دفعة واحدة
    const savedTransactions = await this.transactionsService.processTransactionsBatch(bank, parsedTransactions);
    return savedTransactions;
  }
}
