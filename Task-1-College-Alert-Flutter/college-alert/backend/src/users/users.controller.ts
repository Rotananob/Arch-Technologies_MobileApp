import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get currently authenticated user profile and stats' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile information' })
  async updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(userId, dto);
  }

  @Get('me/registrations')
  @ApiOperation({ summary: 'Get events registered by current student' })
  async getMyRegistrations(@CurrentUser('id') userId: string) {
    return this.usersService.getMyRegistrations(userId);
  }

  @Get('me/saved-events')
  @ApiOperation({ summary: 'Get saved/bookmarked events for current student' })
  async getMySavedEvents(@CurrentUser('id') userId: string) {
    return this.usersService.getMySavedEvents(userId);
  }

  @Get('me/notification-preferences')
  @ApiOperation({ summary: 'Get student notification preferences' })
  async getNotificationPreferences(@CurrentUser('id') userId: string) {
    return this.usersService.getNotificationPreferences(userId);
  }

  @Patch('me/notification-preferences')
  @ApiOperation({ summary: 'Update student notification preferences & FCM token' })
  async updateNotificationPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.usersService.updateNotificationPreferences(userId, dto);
  }
}
