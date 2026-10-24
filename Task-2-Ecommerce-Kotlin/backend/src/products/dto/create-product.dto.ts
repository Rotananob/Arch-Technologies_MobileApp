import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPad Air M2 11-inch' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'iPad Air M2 អេក្រង់ ១១ អ៊ីញ' })
  @IsOptional()
  @IsString()
  titleKh?: string;

  @ApiProperty({ example: 'Space Gray, 128GB, condition like new with original charger.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionKh?: string;

  @ApiProperty({ example: 499.0 })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: 'cat_electronics' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  stockQuantity: number;

  @ApiPropertyOptional({ example: 'BRAND_NEW' })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  imageUrls?: string[];
}
