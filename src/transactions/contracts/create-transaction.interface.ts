export interface ICreateTransaction {
  walletId: string;
  reference: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  bank: string;
  transactionDate: Date;
  metadata?: Record<string, any>;
}