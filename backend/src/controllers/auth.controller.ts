import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { env } from '../config/env';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({
        success: true,
        data: { user: result.user, accessToken: result.accessToken },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, accessToken: result.accessToken },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refresh(refreshToken);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, accessToken: result.accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken, req.user?.userId);
      res.clearCookie('refreshToken');
      res.json({ success: true, data: { message: 'Logged out successfully' } });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
