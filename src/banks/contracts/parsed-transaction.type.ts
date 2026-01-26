
export type ParsedTransaction = {
  reference: string;
  amount: number;
  transactionDate: Date;
  metadata: Record<string, any>;
  bank: string;
};