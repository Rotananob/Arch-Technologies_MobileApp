import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 'prod_123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number = 1;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
