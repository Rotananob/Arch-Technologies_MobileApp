import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rotana Nob' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'STU-2026-089' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ example: 'Computer Science & Software Engineering' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
