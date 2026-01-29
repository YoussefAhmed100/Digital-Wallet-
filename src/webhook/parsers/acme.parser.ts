import { Injectable, BadRequestException } from '@nestjs/common';
import { IBankStrategy } from '../contracts/bank-strategy.interface';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';

@Injectable()
export class AcmeParser implements IBankStrategy {
  parse(payload: string): ParsedTransaction {
    // ✅ إضافة validation
    if (!payload || !payload.includes('//')) {
      throw new BadRequestException('Invalid Acme payload format');
    }

    const [amountRaw, reference, dateRaw] = payload.split('//');

    // ✅ التحقق من وجود كل الأجزاء
    if (!amountRaw || !reference || !dateRaw) {
      throw new BadRequestException('Missing required parts in Acme transaction');
    }

    const amount = Number(amountRaw.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException(`Invalid amount: ${amountRaw}`);
    }

    const transactionDate = this.parseDate(dateRaw.trim());

    if (isNaN(transactionDate.getTime())) {
      throw new BadRequestException(`Invalid date: ${dateRaw}`);
    }

    return {
      reference: reference.trim(), // ✅ إضافة trim
      amount,
      transactionDate,
      rawLine: payload,
      metadata: {},
      type: 'CREDIT',
    };
  }

  private parseDate(date: string): Date {
    // ✅ إضافة validation
    if (!/^\d{8}$/.test(date)) {
      return new Date('invalid');
    }

    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(4, 6)) - 1;
    const day = Number(date.slice(6, 8));

    return new Date(Date.UTC(year, month, day));
  }
}