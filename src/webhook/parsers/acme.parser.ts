// src/banks/parsers/acme.parser.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseBankParser } from './base-bank.parser';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';

@Injectable()
export class AcmeParser extends BaseBankParser {
  protected validatePayloadFormat(payload: string): void {
    if (!payload.includes('//')) {
      throw new BadRequestException('Invalid Acme payload format');
    }
  }

  protected parsePayload(payload: string): ParsedTransaction {
    const [amountRaw, reference, dateRaw] = payload.split('//');

    if (!amountRaw || !reference || !dateRaw) {
      throw new BadRequestException('Missing required parts in Acme transaction');
    }

    const amount = Number(amountRaw.replace(',', '.'));
    const transactionDate = this.parseDate(dateRaw.trim());

    return {
      reference: reference.trim(),
      amount,
      transactionDate,
      metadata: {},
      rawLine: payload,
      type: 'CREDIT',
    };
  }
}
