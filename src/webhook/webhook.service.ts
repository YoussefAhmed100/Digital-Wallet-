import { Injectable, Logger } from '@nestjs/common';
import { BankParserFactory } from './parsers/parser.factory';
import { TransactionService } from 'src/transactions/transactions.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly parserFactory: BankParserFactory,
    private readonly transactionService: TransactionService,
  ) {}

  async process(bank: string, walletId: string, body: string) {
    const parser = this.parserFactory.get(bank);
    const lines = body.split('\n').map(line => line.trim()).filter(Boolean);

    let inserted = 0;
    let skipped = 0;


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      await this.processLine(parser, bank, walletId, line, i + 1)
        .then(result => {
          if (result.success) {
            if (result.duplicate) {
              skipped++;
              this.logger.log(`Line ${i + 1}: Duplicate - skipped`);
            } else {
              inserted++;
              this.logger.log(`Line ${i + 1}: Success`);
            }
          } else {
            skipped++;
      
            this.logger.warn(`Line ${i + 1}: Failed - ${result.error}`);
          }
        })
        .catch(error => {
          skipped++;
  
          this.logger.error(`Line ${i + 1}: Error - ${error.message}`);
        });
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
    parser: any,
    bank: string,
    walletId: string,
    line: string,
    lineNumber: number
  ): Promise<{ success: boolean; duplicate: boolean; error?: string }> {
    
    return new Promise((resolve) => {
      Promise.resolve()
        .then(() => parser.parse(line))
        .then(parsed => {
          return this.transactionService.createTransactionIdempotent({
            ...parsed,
            bank,
            walletId,
          });
        })
        .then(result => {
          resolve({
            success: true,
            duplicate: result.duplicate
          });
        })
        .catch(error => {
          resolve({
            success: false,
            duplicate: false,
            error: error.message || 'Processing failed'
          });
        });
    });
  }
}