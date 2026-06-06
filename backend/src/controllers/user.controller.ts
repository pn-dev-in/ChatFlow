import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { getParam } from '../utils/params';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.searchUsers(
        req.query.q as string,
        Number(req.query.limit) || 20,
        req.user!.userId
      );
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(getParam(req.params.userId));
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
