import { Injectable } from '@nestjs/common';

@Injectable()
export class AcmeParser {
  parseData(raw: string) {
    const lines = raw.trim().split('\n');

    return lines.map((line) => {
      const [amountRaw, reference, dateRaw] = line.split('//');

      const transactionDate = new Date(
        `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
      );

      const amount = Number(amountRaw.replace(',', '.'));

      return {
        reference,
        amount,
        transactionDate,
        bank: 'ACME',
        metadata: {},
      };
    });
  }
}
