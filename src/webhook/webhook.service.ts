import { Injectable, Logger } from '@nestjs/common';
import { BankParserFactory } from './parsers/parser.factory';
import { TransactionService } from 'src/transactions/transactions.service';
import { IBankStrategy } from './contracts/bank-strategy.interface';

interface ProcessLineResult {
  success: boolean;
  duplicate: boolean;
  error?: string;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

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

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;

      const result = await this.processLine(
        parser,
        bank,
        walletId,
        lines[i],
      );

      if (result.success) {
        if (result.duplicate) {
          skipped++;
          this.logger.log(`Line ${lineNumber}: Duplicate - skipped`);
        } else {
          inserted++;
          this.logger.log(`Line ${lineNumber}: Success`);
        }
      } else {
        skipped++;
        this.logger.warn(
          `Line ${lineNumber}: Failed - ${result.error}`,
        );
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
    parser: IBankStrategy,
    bank: string,
    walletId: string,
    line: string,
  ): Promise<ProcessLineResult> {
    try {
      const parsed = parser.parse(line);

      const result =
        await this.transactionService.createTransactionIdempotent({
          ...parsed,
          bank,
          walletId,
        });

      return {
        success: true,
        duplicate: result.duplicate,
      };
    } catch (error) {
      return {
        success: false,
        duplicate: false,
        error: error.message ?? 'Processing failed',
      };
    }
  }
}
