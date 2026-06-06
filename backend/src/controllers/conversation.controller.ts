import { Request, Response, NextFunction } from 'express';
import { conversationService } from '../services/conversation.service';
import { getParam } from '../utils/params';

export class ConversationController {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await conversationService.getUserConversations(req.user!.userId);
      res.json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  }

  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationService.getConversation(
        getParam(req.params.conversationId),
        req.user!.userId
      );
      res.json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }

  async createDirect(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await conversationService.createDirectConversation(
        req.user!.userId,
        req.body.participantId
      );
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await conversationService.markAsRead(
        getParam(req.params.conversationId),
        req.user!.userId
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
