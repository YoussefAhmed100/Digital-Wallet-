
import { create } from 'xmlbuilder2';
import { PaymentRequest } from '../domain/payment-request.model';

export class PaymentXmlBuilder {
  build(payment: PaymentRequest): string {
    const root = create({ version: '1.0', encoding: 'utf-8' })
      .ele('PaymentRequestMessage');

    //@desc=> TransferInfo
    const transfer = root.ele('TransferInfo');
    transfer.ele('Reference').txt(payment.transferInfo.reference);
    transfer.ele('Date').txt(payment.transferInfo.date);
    transfer.ele('Amount').txt(payment.transferInfo.amount.toFixed(2));
    transfer.ele('Currency').txt(payment.transferInfo.currency);

    // @desc=>senderInfo
    root.ele('SenderInfo')
      .ele('AccountNumber')
      .txt(payment.senderInfo.accountNumber);

    //@desc=> ReceiverInfo
    const receiver = root.ele('ReceiverInfo');
    receiver.ele('BankCode').txt(payment.receiverInfo.bankCode);
    receiver.ele('AccountNumber').txt(payment.receiverInfo.accountNumber);
    receiver.ele('BeneficiaryName').txt(payment.receiverInfo.beneficiaryName);

    // Notes (conditional)
    if (payment.notes && payment.notes.length > 0) {
      const notes = root.ele('Notes');
      payment.notes.forEach(note =>
        notes.ele('Note').txt(note),
      );
    }

    // PaymentType 
    if (payment.paymentType !== undefined && payment.paymentType !== 99) {
      root.ele('PaymentType').txt(payment.paymentType.toString());
    }

    // ChargeDetails 
    if (payment.chargeDetails && payment.chargeDetails !== 'SHA') {
      root.ele('ChargeDetails').txt(payment.chargeDetails);
    }
 
    return root.end({ prettyPrint: true });
  }
}
