import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { getParam } from '../utils/params';

export class AiController {
  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await aiService.createConversation(req.user!.userId, req.body.title);
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }

  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await aiService.getConversations(req.user!.userId);
      res.json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  }

  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await aiService.getConversation(
        getParam(req.params.aiConversationId),
        req.user!.userId
      );
      res.json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await aiService.sendMessage(
        getParam(req.params.aiConversationId),
        req.user!.userId,
        req.body.content
      );
      res.json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async generateReply(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateReply(req.body.text);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async summarize(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.summarizeConversation(
        req.body.conversationId,
        req.user!.userId
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async translate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.translate(req.body.text, req.body.targetLanguage || 'English');
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async correctGrammar(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.correctGrammar(req.body.text);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.getSuggestions(req.body.text);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AiController();
