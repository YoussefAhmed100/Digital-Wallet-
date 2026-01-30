
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRequest } from './domain/payment-request.model';
import { PaymentXmlBuilder } from './xml/payment-xml.builder';

@Injectable()
export class PaymentsService {
  private xmlBuilder = new PaymentXmlBuilder();

  generateXml(dto: CreatePaymentDto): string {
    const payment = new PaymentRequest(
      {
        reference: dto.reference,
        date: dto.date,
        amount: dto.amount,
        currency: dto.currency,
      },
      {
        accountNumber: dto.senderAccount,
      },
      {
        bankCode: dto.receiverBankCode,
        accountNumber: dto.receiverAccount,
        beneficiaryName: dto.beneficiaryName,
      },
      dto.notes,
      dto.paymentType ?? 99,
      dto.chargeDetails ?? 'SHA',
    );

    return this.xmlBuilder.build(payment);
  }
}
