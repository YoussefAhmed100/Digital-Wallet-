export class PaymentRequest {
  constructor(
    public readonly transferInfo: {
      reference: string;
      date: string;
      amount: number;
      currency: string;
    },
    public readonly senderInfo: {
      accountNumber: string;
    },
    public readonly receiverInfo: {
      bankCode: string;
      accountNumber: string;
      beneficiaryName: string;
    },
    public readonly notes?: string[],
    public readonly paymentType?: number,
    public readonly chargeDetails?: string,
  ) {}
}
