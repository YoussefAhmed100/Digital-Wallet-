
import { BadRequestException } from '@nestjs/common';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';

export abstract class BaseBankParser {
  parse(payload: string): ParsedTransaction {
    if (!payload) {
      throw new BadRequestException('Payload is empty');
    }

    this.validatePayloadFormat(payload);

    const parsed = this.parsePayload(payload);
    this.validateParsedTransaction(parsed);

    return {
      ...parsed,
      rawLine: payload,
      metadata: parsed.metadata || {},
      type: 'CREDIT',  // or set dynamically if needed
    };
  }

  protected abstract validatePayloadFormat(payload: string): void;

  protected abstract parsePayload(payload: string): ParsedTransaction;

  protected validateParsedTransaction(parsed: ParsedTransaction) {
    if (!parsed.reference || parsed.reference.trim().length === 0) {
      throw new BadRequestException('Reference is required');
    }

    if (isNaN(parsed.amount) || parsed.amount <= 0) {
      throw new BadRequestException(`Invalid amount: ${parsed.amount}`);
    }

    if (!(parsed.transactionDate instanceof Date) || isNaN(parsed.transactionDate.getTime())) {
      throw new BadRequestException(`Invalid transaction date`);
    }
  }

  protected parseDate(date: string): Date {
    if (!/^\d{8}$/.test(date)) {
      return new Date('invalid');
    }
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(4, 6)) - 1;
    const day = Number(date.slice(6, 8));
    return new Date(Date.UTC(year, month, day));
  }

  protected parseMetadata(meta: string): Record<string, any> {
    const parts = meta.split('/');
    const result: Record<string, any> = {};

    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1] !== undefined) {
        result[parts[i].trim()] = parts[i + 1].trim();
      }
    }

    return result;
  }
}
