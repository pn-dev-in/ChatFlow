import { Request, Response, NextFunction } from 'express';
import { GroupRole } from '@prisma/client';
import { groupService } from '../services/group.service';
import { getParam } from '../utils/params';

export class GroupController {
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.createGroup(req.user!.userId, req.body);
      res.status(201).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.getGroup(getParam(req.params.groupId), req.user!.userId);
      res.json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async updateGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.updateGroup(getParam(req.params.groupId), req.user!.userId, req.body);
      res.json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await groupService.addMember(
        getParam(req.params.groupId),
        req.user!.userId,
        req.body.userId,
        req.body.role as GroupRole
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await groupService.removeMember(
        getParam(req.params.groupId),
        req.user!.userId,
        getParam(req.params.userId)
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const groupController = new GroupController();
