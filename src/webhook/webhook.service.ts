import { Injectable } from '@nestjs/common';
import { BankParserFactory } from './parsers/parser.factory';
import { TransactionService } from 'src/transactions/transactions.service';
import { BaseBankParser } from './parsers/base-bank.parser';

@Injectable()
export class WebhookService {
  constructor(
    private readonly parserFactory: BankParserFactory,
    private readonly transactionService: TransactionService,
  ) {}

  async process(bank: string, walletId: string, body: string) {
    const parser = this.parserFactory.get(bank);

    const lines = body
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    let inserted = 0;
    let skipped = 0;

    for (const line of lines) {
      const result = await this.processLine(
        parser,
        bank,
        walletId,
        line,
      );

      if (result.duplicate) {
        skipped++;
      } else {
        inserted++;
      }
    }

    return {
      bank,
      walletId,
      totalLines: lines.length,
      inserted,
      skipped,
    };
  }

  private async processLine(
    parser: BaseBankParser, 
    bank: string,
    walletId: string,
    line: string,
  ): Promise<{ duplicate: boolean }> {
    const parsed = parser.parse(line);

    const result =
      await this.transactionService.createTransactionIdempotent({
        ...parsed,
        bank,
        walletId,
      });

    return {
      duplicate: result.duplicate,
    };
  }
}
