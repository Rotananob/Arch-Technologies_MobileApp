import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            titleKh: true,
            startDate: true,
            location: true,
            category: { select: { name: true, colorHex: true } },
          },
        },
      },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return {
      notifications,
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true, message: 'All notifications marked as read' };
  }
}
