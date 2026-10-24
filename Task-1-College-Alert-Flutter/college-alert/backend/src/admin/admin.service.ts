import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { UpdateEventDto } from '../events/dto/update-event.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listEvents(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          _count: {
            select: { registrations: true },
          },
        },
      }),
      this.prisma.event.count(),
    ]);

    return {
      data: events,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async createEvent(dto: CreateEventDto) {
    const { categoryId, startDate, endDate, ...rest } = dto;
    const event = await this.prisma.event.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        category: { connect: { id: categoryId } },
      },
      include: { category: true },
    });

    // If it's a priority alert or featured, dispatch notifications to all users who enabled announcements
    if (event.priorityAlert) {
      const users = await this.prisma.user.findMany({
        where: { preferences: { eventAnnouncements: true } },
        select: { id: true },
      });

      if (users.length > 0) {
        await this.prisma.notification.createMany({
          data: users.map((u) => ({
            userId: u.id,
            eventId: event.id,
            title: `🚨 Urgent Campus Alert: ${event.title}`,
            titleKh: `🚨 ដំណឹងបន្ទាន់សាលា៖ ${event.titleKh || event.title}`,
            message: event.description.substring(0, 160) + '...',
            messageKh: (event.descriptionKh || event.description).substring(0, 160) + '...',
            type: 'EVENT_ANNOUNCEMENT',
          })),
        });
      }
    }

    return event;
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const { categoryId, startDate, endDate, ...rest } = dto;
    const data: any = { ...rest };
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (categoryId) data.category = { connect: { id: categoryId } };

    return this.prisma.event.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async togglePublish(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.prisma.event.update({
      where: { id },
      data: { isPublished: !existing.isPublished },
    });
  }

  async deleteEvent(id: string) {
    const existing = await this.prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.prisma.event.delete({ where: { id } });
    return { success: true, message: 'Event successfully deleted' };
  }

  async getEventRegistrations(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                studentId: true,
                department: true,
                phoneNumber: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return {
      eventId: event.id,
      eventTitle: event.title,
      maxCapacity: event.maxCapacity,
      totalRegistrations: event.registrations.length,
      registrations: event.registrations,
    };
  }

  async broadcastAnnouncement(eventId: string, title: string, message: string) {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: { eventId, status: 'REGISTERED' },
      select: { userId: true },
    });

    if (registrations.length === 0) {
      return { success: true, message: 'No registered students for this event' };
    }

    await this.prisma.notification.createMany({
      data: registrations.map((r) => ({
        userId: r.userId,
        eventId,
        title,
        message,
        type: 'EVENT_UPDATE',
      })),
    });

    return {
      success: true,
      message: `Announcement sent to ${registrations.length} registered students`,
    };
  }
}
