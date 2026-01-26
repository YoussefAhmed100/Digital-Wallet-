import { ParsedTransaction } from './parsed-transaction.type';

export interface IBankStrategy {
  readonly bankName: 'PAYTECH' | 'ACME';
  parse(payload: string): ParsedTransaction[];
}
