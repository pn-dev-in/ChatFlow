import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createAiConversationSchema,
  sendAiMessageSchema,
  aiActionSchema,
  aiConversationIdSchema,
} from '../validators/ai.validator';

const router = Router();

router.use(authenticate);

router.post('/conversations', validate(createAiConversationSchema), aiController.createConversation.bind(aiController));
router.get('/conversations', aiController.getConversations.bind(aiController));
router.get('/conversations/:aiConversationId', validate(aiConversationIdSchema, 'params'), aiController.getConversation.bind(aiController));
router.post('/conversations/:aiConversationId/messages', validate(aiConversationIdSchema, 'params'), validate(sendAiMessageSchema), aiController.sendMessage.bind(aiController));
router.post('/reply', validate(aiActionSchema), aiController.generateReply.bind(aiController));
router.post('/summarize', validate(aiActionSchema), aiController.summarize.bind(aiController));
router.post('/translate', validate(aiActionSchema), aiController.translate.bind(aiController));
router.post('/grammar', validate(aiActionSchema), aiController.correctGrammar.bind(aiController));
router.post('/suggestions', validate(aiActionSchema), aiController.getSuggestions.bind(aiController));

export default router;
