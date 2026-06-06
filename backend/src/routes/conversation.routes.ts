import { Router } from 'express';
import { conversationController } from '../controllers/conversation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createDirectConversationSchema,
  conversationIdSchema,
} from '../validators/conversation.validator';

const router = Router();

router.use(authenticate);

router.get('/', conversationController.getConversations.bind(conversationController));
router.post('/direct', validate(createDirectConversationSchema), conversationController.createDirect.bind(conversationController));
router.get('/:conversationId', validate(conversationIdSchema, 'params'), conversationController.getConversation.bind(conversationController));
router.post('/:conversationId/read', validate(conversationIdSchema, 'params'), conversationController.markAsRead.bind(conversationController));

export default router;
