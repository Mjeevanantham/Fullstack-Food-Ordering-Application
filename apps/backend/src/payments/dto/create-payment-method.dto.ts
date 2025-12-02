import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethodType } from '../../common/enums/payment-method-type.enum';

export class CreatePaymentMethodDto {
  @ApiProperty({ enum: PaymentMethodType })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  last4?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand?: string;
}

