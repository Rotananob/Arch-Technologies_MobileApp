import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventQueryDto } from './dto/event-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List published campus events with search, filter, and pagination' })
  async findAll(@Query() query: EventQueryDto, @CurrentUser('id') userId?: string) {
    return this.eventsService.findAll(query, userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming featured and priority campus events' })
  async findUpcoming(@Query('limit') limit?: number, @CurrentUser('id') userId?: string) {
    return this.eventsService.findUpcoming(limit ? Number(limit) : 5, userId);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get current featured campus event for hero display' })
  async findFeatured(@CurrentUser('id') userId?: string) {
    return this.eventsService.findFeatured(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details by ID' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.eventsService.findOne(id, userId);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for an event' })
  async register(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.registerUserForEvent(id, userId);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel event registration' })
  async cancelRegistration(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.cancelRegistration(id, userId);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bookmark / save an event' })
  async saveEvent(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.saveEvent(id, userId);
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove event from bookmarks' })
  async unsaveEvent(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.eventsService.unsaveEvent(id, userId);
  }
}
