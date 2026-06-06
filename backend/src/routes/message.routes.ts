import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  sendMessageSchema,
  editMessageSchema,
  messageIdSchema,
  searchMessagesSchema,
  reactionSchema,
} from '../validators/message.validator';
import { conversationIdSchema, paginationSchema } from '../validators/conversation.validator';

const router = Router();

router.use(authenticate);

router.get('/search', validate(searchMessagesSchema, 'query'), messageController.searchMessages.bind(messageController));
router.get('/:conversationId', validate(conversationIdSchema, 'params'), validate(paginationSchema, 'query'), messageController.getMessages.bind(messageController));
router.post('/:conversationId', validate(conversationIdSchema, 'params'), validate(sendMessageSchema), messageController.sendMessage.bind(messageController));
router.patch('/:messageId', validate(messageIdSchema, 'params'), validate(editMessageSchema), messageController.editMessage.bind(messageController));
router.delete('/:messageId', validate(messageIdSchema, 'params'), messageController.deleteMessage.bind(messageController));
router.post('/:messageId/reactions', validate(messageIdSchema, 'params'), validate(reactionSchema), messageController.addReaction.bind(messageController));
router.delete('/:messageId/reactions', validate(messageIdSchema, 'params'), validate(reactionSchema), messageController.removeReaction.bind(messageController));

export default router;
