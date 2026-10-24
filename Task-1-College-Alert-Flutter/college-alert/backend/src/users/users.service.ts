import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        studentId: true,
        department: true,
        phoneNumber: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        preferences: true,
        _count: {
          select: {
            registrations: { where: { status: 'REGISTERED' } },
            savedEvents: true,
            notifications: { where: { isRead: false } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      activeRegistrationsCount: user._count.registrations,
      savedEventsCount: user._count.savedEvents,
      unreadNotificationsCount: user._count.notifications,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        studentId: true,
        department: true,
        phoneNumber: true,
        role: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });
  }

  async getMyRegistrations(userId: string) {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: { userId, status: 'REGISTERED' },
      orderBy: { event: { startDate: 'asc' } },
      include: {
        event: {
          include: {
            category: true,
          },
        },
      },
    });

    return registrations.map((r) => ({
      id: r.id,
      status: r.status,
      registeredAt: r.createdAt,
      event: r.event,
    }));
  }

  async getMySavedEvents(userId: string) {
    const saved = await this.prisma.savedEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          include: {
            category: true,
            _count: { select: { registrations: { where: { status: 'REGISTERED' } } } },
          },
        },
      },
    });

    return saved.map((s) => ({
      savedAt: s.createdAt,
      event: {
        ...s.event,
        isSaved: true,
        registeredCount: s.event._count.registrations,
      },
    }));
  }

  async getNotificationPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({
        data: { userId },
      });
    }
    return prefs;
  }

  async updateNotificationPreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: dto,
    });
  }
}
