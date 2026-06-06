import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service';
import { ValidationError } from '../utils/errors';

export class MediaController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new ValidationError('No file provided');

      const result = await mediaService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
