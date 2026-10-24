import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Annual Engineering & Tech Expo 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'ពិព័រណ៍បច្ចេកវិទ្យា និងវិស្វកម្មប្រចាំឆ្នាំ ២០២៦' })
  @IsOptional()
  @IsString()
  titleKh?: string;

  @ApiProperty({ example: 'Showcase of outstanding senior capstone projects...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'ការតាំងបង្ហាញគម្រោងឆ្នើមរបស់និស្សិតឆ្នាំចុងក្រោយ...' })
  @IsOptional()
  @IsString()
  descriptionKh?: string;

  @ApiProperty({ example: 'uuid-category-id' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'Main Auditorium, Building C' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiPropertyOptional({ example: 'https://meet.university.edu/expo' })
  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @ApiProperty({ example: 'Faculty of Engineering & Robotics Club' })
  @IsString()
  @IsNotEmpty()
  organizer: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '2026-11-05T09:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-11-05T17:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isRegistrationRequired?: boolean;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  priorityAlert?: boolean;
}
