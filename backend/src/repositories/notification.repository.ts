import { NotificationType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class NotificationRepository {
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Prisma.InputJsonValue;
  }) {
    return prisma.notification.create({ data });
  }

  async findByUser(userId: string, limit = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
