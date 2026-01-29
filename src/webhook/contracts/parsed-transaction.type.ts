export type ParsedTransaction = {
  reference: string;
  amount: number;
  transactionDate: Date;
  metadata: Record<string, any>;
  walletId?: string;
  type: 'CREDIT' | 'DEBIT';
  bank?: string;
  rawLine: string;
 
};


