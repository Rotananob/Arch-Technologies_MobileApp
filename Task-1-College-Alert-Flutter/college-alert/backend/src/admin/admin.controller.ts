import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { UpdateEventDto } from '../events/dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('events')
  @ApiOperation({ summary: 'Admin list all events including drafts' })
  async listEvents(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.listEvents(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Post('events')
  @ApiOperation({ summary: 'Create a new campus event' })
  async createEvent(@Body() dto: CreateEventDto) {
    return this.adminService.createEvent(dto);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: 'Update an existing campus event' })
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.adminService.updateEvent(id, dto);
  }

  @Patch('events/:id/publish')
  @ApiOperation({ summary: 'Toggle publish/unpublish status of an event' })
  async togglePublish(@Param('id') id: string) {
    return this.adminService.togglePublish(id);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete a campus event' })
  async deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  @Get('events/:id/registrations')
  @ApiOperation({ summary: 'Get all students registered for an event' })
  async getRegistrations(@Param('id') id: string) {
    return this.adminService.getEventRegistrations(id);
  }

  @Post('events/:id/broadcast')
  @ApiOperation({ summary: 'Broadcast urgent announcement to registered students' })
  async broadcastAnnouncement(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    return this.adminService.broadcastAnnouncement(id, title, message);
  }
}
