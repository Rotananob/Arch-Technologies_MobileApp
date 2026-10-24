import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  eventAnnouncements?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  upcomingReminders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  registrationUpdates?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  generalAlerts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
