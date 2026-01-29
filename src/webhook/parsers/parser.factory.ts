import { Injectable, BadRequestException } from '@nestjs/common';
import { PayTechParser } from './paytech.parser';
import { AcmeParser } from './acme.parser';
import { IBankStrategy } from '../contracts/bank-strategy.interface';

@Injectable()
export class BankParserFactory {
  constructor(
    private readonly payTechParser: PayTechParser,
    private readonly acmeParser: AcmeParser,
  ) {}

  get(bank: string): IBankStrategy {
    // ✅ إضافة normalization
    const normalizedBank = bank?.toLowerCase().trim();

    if (normalizedBank === 'paytech') return this.payTechParser;
    if (normalizedBank === 'acme') return this.acmeParser;

    throw new BadRequestException(`Unsupported bank: ${bank}`);
  }
}