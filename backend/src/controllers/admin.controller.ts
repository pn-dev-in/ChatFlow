import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { getParam } from '../utils/params';

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getUsers(
        Number(req.query.page) || 1,
        Number(req.query.limit) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserActive(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminService.toggleUserActive(
        getParam(req.params.userId),
        req.user!.userId,
        req.ip
      );
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.getGroups(
        Number(req.query.page) || 1,
        Number(req.query.limit) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await adminService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await adminService.getAuditLogs(Number(req.query.limit) || 100);
      res.json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
