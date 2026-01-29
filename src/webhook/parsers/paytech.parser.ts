import { Injectable, BadRequestException } from '@nestjs/common';
import { IBankStrategy } from '../contracts/bank-strategy.interface';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';

@Injectable()
export class PayTechParser implements IBankStrategy {
  parse(payload: string): ParsedTransaction {
    if (!payload || !payload.includes('#')) {
      throw new BadRequestException('Invalid PayTech payload format');
    }

    const [part1, reference, metaPart] = payload.split('#');

    if (!part1 || part1.length < 8) {
      throw new BadRequestException('Invalid PayTech transaction part');
    }

    const dateRaw = part1.slice(0, 8);
    const amountRaw = part1.slice(8);

    const transactionDate = this.parseDate(dateRaw);

    if (isNaN(transactionDate.getTime())) {
      throw new BadRequestException(`Invalid transaction date: ${dateRaw}`);
    }

    const amount = Number(amountRaw.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException(`Invalid amount: ${amountRaw}`);
    }

    // ✅ تأكد من وجود reference
    if (!reference || reference.trim().length === 0) {
      throw new BadRequestException('Reference is required');
    }

    return {
      reference: reference.trim(), // ✅ إضافة trim
      amount,
      transactionDate,
      rawLine: payload,
      metadata: metaPart ? this.parseMetadata(metaPart) : {},
      type: 'CREDIT',
    };
  }

  private parseDate(date: string): Date {
    if (!/^\d{8}$/.test(date)) {
      return new Date('invalid');
    }

    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(4, 6)) - 1;
    const day = Number(date.slice(6, 8));

    return new Date(Date.UTC(year, month, day));
  }

  private parseMetadata(meta: string): Record<string, any> {
    const parts = meta.split('/');
    const result: Record<string, any> = {};

    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1] !== undefined) { // ✅ تحسين الشرط
        result[parts[i].trim()] = parts[i + 1].trim(); // ✅ إضافة trim
      }
    }

    return result;
  }
}