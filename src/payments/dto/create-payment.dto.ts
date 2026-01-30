import { 
  IsString, IsNumber, IsOptional, IsArray, ArrayNotEmpty, IsDateString, Min, MaxLength, Matches 
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @MaxLength(50)
  reference: string;

  @IsDateString()
  date: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'Currency must be a 3-letter uppercase code' })
  currency: string;

  @IsString()
  senderAccount: string;

  @IsString()
  receiverBankCode: string;

  @IsString()
  receiverAccount: string;

  @IsString()
  beneficiaryName: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  notes: string[];

  @IsOptional()
  @IsNumber()
  paymentType: number; // default 99

  @IsOptional()
  @IsString()
  chargeDetails  : string; // default SHA
}
