import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'order_123' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: 'SUCCESS', enum: ['SUCCESS', 'FAILED', 'CANCELLED'] })
  @IsString()
  @IsIn(['SUCCESS', 'FAILED', 'CANCELLED'])
  outcome: string;
}
