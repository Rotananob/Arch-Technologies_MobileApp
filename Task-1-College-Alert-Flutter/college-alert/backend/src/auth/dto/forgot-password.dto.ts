import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'rotana.nob@university.edu' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
