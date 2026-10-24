import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'Rotana Nob' })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiProperty({ example: '+855 12 345 678' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Street 2004, Sen Sok' })
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty({ example: 'Phnom Penh' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Engineering Building B, Room 302' })
  @IsOptional()
  @IsString()
  campusBuilding?: string;

  @ApiProperty({ example: 'MOCK_PAYMENT' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
