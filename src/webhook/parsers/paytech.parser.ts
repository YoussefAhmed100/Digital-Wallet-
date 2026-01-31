import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseBankParser } from './base-bank.parser';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';

@Injectable()
export class PayTechParser extends BaseBankParser {
  protected validatePayloadFormat(payload: string):void {
    if (!payload.includes('#')) {
      throw new BadRequestException('Invalid PayTech payload format');
    }
   

  }

  protected parsePayload(payload: string): ParsedTransaction {
    const [part1, reference, metaPart] = payload.split('#');

    if (!part1 || part1.length < 8) {
      throw new BadRequestException('Invalid PayTech transaction part');
    }

    const dateRaw = part1.slice(0, 8);
    const amountRaw = part1.slice(8);

    const transactionDate = this.parseDate(dateRaw);
    const amount = Number(amountRaw.replace(',', '.'));

    return {
      reference: reference.trim(),
      amount,
      transactionDate,
      metadata: metaPart ? this.parseMetadata(metaPart) : {},
      rawLine: payload,
      type: 'CREDIT',
    };
  }
}
