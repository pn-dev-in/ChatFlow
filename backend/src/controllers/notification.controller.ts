import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { getParam } from '../utils/params';

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getNotifications(req.user!.userId);
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.getUnreadCount(req.user!.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAsRead(getParam(req.params.notificationId), req.user!.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAllAsRead(req.user!.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
