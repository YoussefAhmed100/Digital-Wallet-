// payments.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('xml')
  generate(@Body() dto: CreatePaymentDto) {
    return this.service.generateXml(dto);
  }
}
