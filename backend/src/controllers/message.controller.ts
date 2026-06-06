import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { getParam } from '../utils/params';

export class MessageController {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageService.getMessages(
        getParam(req.params.conversationId),
        req.user!.userId,
        req.query.cursor as string | undefined,
        Number(req.query.limit) || 50
      );
      res.json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await messageService.sendMessage(req.user!.userId, {
        conversationId: getParam(req.params.conversationId),
        ...req.body,
      });
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async editMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await messageService.editMessage(
        getParam(req.params.messageId),
        req.user!.userId,
        req.body.content
      );
      res.json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await messageService.deleteMessage(
        getParam(req.params.messageId),
        req.user!.userId,
        req.query.deleteForAll === 'true'
      );
      res.json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async addReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const reaction = await messageService.addReaction(
        getParam(req.params.messageId),
        req.user!.userId,
        req.body.emoji
      );
      res.json({ success: true, data: reaction });
    } catch (error) {
      next(error);
    }
  }

  async removeReaction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await messageService.removeReaction(
        getParam(req.params.messageId),
        req.user!.userId,
        req.body.emoji
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async searchMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageService.searchMessages(
        req.user!.userId,
        req.query.q as string,
        req.query.conversationId as string | undefined,
        Number(req.query.limit) || 20
      );
      res.json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
