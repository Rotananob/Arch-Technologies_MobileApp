import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: EventQueryDto, currentUserId?: string) {
    const { search, categoryId, date, month, upcomingOnly, featured, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    if (upcomingOnly) {
      where.startDate = { gte: new Date() };
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.startDate = { gte: start, lte: end };
    } else if (month) {
      // YYYY-MM
      const [year, monthNum] = month.split('-').map(Number);
      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 0, 23, 59, 59, 999);
      where.startDate = { gte: start, lte: end };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priorityAlert: 'desc' }, { startDate: 'asc' }],
        include: {
          category: {
            select: { id: true, name: true, nameKh: true, icon: true, colorHex: true },
          },
          _count: {
            select: { registrations: { where: { status: 'REGISTERED' } } },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    let userSavedEventIds = new Set<string>();
    let userRegisteredEventIds = new Set<string>();

    if (currentUserId) {
      const [saved, registered] = await Promise.all([
        this.prisma.savedEvent.findMany({
          where: { userId: currentUserId },
          select: { eventId: true },
        }),
        this.prisma.eventRegistration.findMany({
          where: { userId: currentUserId, status: 'REGISTERED' },
          select: { eventId: true },
        }),
      ]);
      userSavedEventIds = new Set(saved.map((s) => s.eventId));
      userRegisteredEventIds = new Set(registered.map((r) => r.eventId));
    }

    const data = events.map((event) => ({
      ...event,
      isSaved: userSavedEventIds.has(event.id),
      isRegistered: userRegisteredEventIds.has(event.id),
      registeredCount: event._count.registrations,
      isFull: event.maxCapacity ? event._count.registrations >= event.maxCapacity : false,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUpcoming(limit = 5, currentUserId?: string) {
    return this.findAll({ upcomingOnly: true, limit, page: 1 }, currentUserId);
  }

  async findFeatured(currentUserId?: string) {
    const featured = await this.prisma.event.findFirst({
      where: { isPublished: true, isFeatured: true, startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      include: {
        category: true,
        _count: {
          select: { registrations: { where: { status: 'REGISTERED' } } },
        },
      },
    });

    if (!featured) {
      // Fallback to earliest upcoming
      return this.prisma.event.findFirst({
        where: { isPublished: true, startDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
        include: {
          category: true,
          _count: {
            select: { registrations: { where: { status: 'REGISTERED' } } },
          },
        },
      });
    }

    let isSaved = false;
    let isRegistered = false;
    if (currentUserId && featured) {
      const [s, r] = await Promise.all([
        this.prisma.savedEvent.findUnique({
          where: { userId_eventId: { userId: currentUserId, eventId: featured.id } },
        }),
        this.prisma.eventRegistration.findUnique({
          where: { userId_eventId: { userId: currentUserId, eventId: featured.id } },
        }),
      ]);
      isSaved = !!s;
      isRegistered = r?.status === 'REGISTERED';
    }

    return {
      ...featured,
      isSaved,
      isRegistered,
      registeredCount: featured._count.registrations,
    };
  }

  async findOne(id: string, currentUserId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { registrations: { where: { status: 'REGISTERED' } } },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    let isSaved = false;
    let isRegistered = false;
    if (currentUserId) {
      const [s, r] = await Promise.all([
        this.prisma.savedEvent.findUnique({
          where: { userId_eventId: { userId: currentUserId, eventId: id } },
        }),
        this.prisma.eventRegistration.findUnique({
          where: { userId_eventId: { userId: currentUserId, eventId: id } },
        }),
      ]);
      isSaved = !!s;
      isRegistered = r?.status === 'REGISTERED';
    }

    return {
      ...event,
      isSaved,
      isRegistered,
      registeredCount: event._count.registrations,
      isFull: event.maxCapacity ? event._count.registrations >= event.maxCapacity : false,
    };
  }

  async registerUserForEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: { where: { status: 'REGISTERED' } } },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event not found`);
    }

    if (!event.isRegistrationRequired) {
      throw new BadRequestException('This event does not require registration');
    }

    if (event.startDate < new Date()) {
      throw new BadRequestException('Cannot register for an event that has already started');
    }

    if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
      throw new BadRequestException('Event has reached maximum capacity');
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing && existing.status === 'REGISTERED') {
      throw new ConflictException('You are already registered for this event');
    }

    const registration = await this.prisma.eventRegistration.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: { userId, eventId, status: 'REGISTERED' },
      update: { status: 'REGISTERED' },
    });

    // Create confirmation in-app notification
    await this.prisma.notification.create({
      data: {
        userId,
        eventId,
        title: 'Registration Confirmed',
        titleKh: 'ការចុះឈ្មោះត្រូវបានបញ្ជាក់',
        message: `Your registration for "${event.title}" has been confirmed!`,
        messageKh: `ការចុះឈ្មោះរបស់អ្នកសម្រាប់ "${event.titleKh || event.title}" ត្រូវបានជោគជ័យ!`,
        type: 'REGISTRATION_CONFIRMED',
      },
    });

    return {
      success: true,
      message: 'Successfully registered for event',
      registration,
    };
  }

  async cancelRegistration(eventId: string, userId: string) {
    const existing = await this.prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!existing || existing.status !== 'REGISTERED') {
      throw new NotFoundException('You do not have an active registration for this event');
    }

    await this.prisma.eventRegistration.update({
      where: { userId_eventId: { userId, eventId } },
      data: { status: 'CANCELLED' },
    });

    return {
      success: true,
      message: 'Registration successfully cancelled',
    };
  }

  async saveEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.savedEvent.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: { userId, eventId },
      update: {},
    });

    return { success: true, message: 'Event saved to your bookmarks' };
  }

  async unsaveEvent(eventId: string, userId: string) {
    try {
      await this.prisma.savedEvent.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch {
      // Ignore if record already absent
    }
    return { success: true, message: 'Event removed from bookmarks' };
  }
}
