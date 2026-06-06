import { Request, Response, NextFunction } from 'express';
import { friendService } from '../services/friend.service';
import { getParam } from '../utils/params';

export class FriendController {
  async sendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await friendService.sendRequest(req.user!.userId, req.body.receiverId);
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await friendService.getPendingRequests(req.user!.userId);
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await friendService.acceptRequest(getParam(req.params.requestId), req.user!.userId);
      res.json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await friendService.rejectRequest(getParam(req.params.requestId), req.user!.userId);
      res.json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }
}

export const friendController = new FriendController();
