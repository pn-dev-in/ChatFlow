import { notificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  async getNotifications(userId: string, limit = 50) {
    return notificationRepository.findByUser(userId, limit);
  }

  async getUnreadCount(userId: string) {
    const count = await notificationRepository.getUnreadCount(userId);
    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    await notificationRepository.markAsRead(notificationId, userId);
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);
    return { success: true };
  }
}

export const notificationService = new NotificationService();
