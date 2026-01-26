import { IBankStrategy } from '../contracts/bank-strategy.interface';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';
import { ParserException } from '../../common/exceptions/parser.exception';

export class PayTechParser implements IBankStrategy {
  readonly bankName = 'PAYTECH';

  parse(payload: string): ParsedTransaction[] {
  if (!payload || typeof payload !== 'string') {
    throw new ParserException(this.bankName, payload, 'Invalid payload');
  }

  const lines = payload
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

    return lines.map((line) => {
      const parts = line.split('#');

      if (parts.length < 2) {
        throw new ParserException(this.bankName, line);
      }

      const [dateAmount, reference, meta] = parts;

      const [dateStr, amountStr] = dateAmount.split(',');

      if (!dateStr || !amountStr) {
        throw new ParserException(this.bankName, line);
      }

      const amount = Number(amountStr.replace(',', '.'));
      if (Number.isNaN(amount)) {
        throw new ParserException(this.bankName, line, 'Invalid amount');
      }

      const date = new Date(
        Number(dateStr.slice(0, 4)),
        Number(dateStr.slice(4, 6)) - 1,
        Number(dateStr.slice(6, 8)),
      );

      if (Number.isNaN(date.getTime())) {
        throw new ParserException(this.bankName, line, 'Invalid date');
      }

      const metadata: Record<string, string> = {};

      if (meta) {
        const metaParts = meta.split('/');
        if (metaParts.length % 2 !== 0) {
          throw new ParserException(this.bankName, line, 'Invalid metadata');
        }

        for (let i = 0; i < metaParts.length; i += 2) {
          metadata[metaParts[i]] = metaParts[i + 1];
        }
      }

      return {
        reference,
        amount,
        transactionDate: date,
        bank: 'PAYTECH',
        metadata,
      };
    });
  }
}
