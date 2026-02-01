import { Injectable, BadRequestException } from '@nestjs/common';
import { PayTechParser } from './paytech.parser';
import { AcmeParser } from './acme.parser';

@Injectable()
export class BankParserFactory {
  constructor(
    private readonly payTechParser: PayTechParser,
    private readonly acmeParser: AcmeParser,
  ) {}

  get(bank: string){
   
    const normalizedBank = bank.toLowerCase().trim();

     switch (normalizedBank) {
      case 'paytech':
        return this.payTechParser;
      case 'acme':
        return this.acmeParser;
      default:
        throw new BadRequestException(`Unsupported bank: ${bank}`);
    }
  }
}