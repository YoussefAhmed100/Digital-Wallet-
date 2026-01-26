import { IBankStrategy } from '../contracts/bank-strategy.interface';
import { ParsedTransaction } from '../contracts/parsed-transaction.type';
import { ParserException } from '../../common/exceptions/parser.exception';

export class AcmeParser implements IBankStrategy {
  readonly bankName = 'ACME';

  parse(payload: string): ParsedTransaction[] {
    if (!payload || typeof payload !== 'string') {
      throw new ParserException(this.bankName, payload, 'Invalid payload');
    }

    const lines = payload.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

    return lines.map((line) => {
      const parts = line.split('//');

      if (parts.length !== 3) {
        throw new ParserException(this.bankName, line);
      }

      const [amountStr, reference, dateStr] = parts;

      const amount = Number(amountStr.replace(',', '.'));
      if (Number.isNaN(amount)) {
        throw new ParserException(this.bankName, line, 'Invalid amount');
      }

      if (!reference) {
        throw new ParserException(this.bankName, line, 'Missing reference');
      }

      const date = new Date(
        Number(dateStr.slice(0, 4)),
        Number(dateStr.slice(4, 6)) - 1,
        Number(dateStr.slice(6, 8)),
      );

      if (Number.isNaN(date.getTime())) {
        throw new ParserException(this.bankName, line, 'Invalid date');
      }

      return {
        reference,
        amount,
        transactionDate: date,
        bank: 'ACME',
        metadata: {}, // Acme has no metadata
      };
    });
  }
}
