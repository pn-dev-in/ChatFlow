import { Router } from 'express';
import { friendController } from '../controllers/friend.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendFriendRequestSchema, friendRequestIdSchema } from '../validators/friend.validator';

const router = Router();

router.use(authenticate);

router.post('/requests', validate(sendFriendRequestSchema), friendController.sendRequest.bind(friendController));
router.get('/requests', friendController.getPending.bind(friendController));
router.post('/requests/:requestId/accept', validate(friendRequestIdSchema, 'params'), friendController.acceptRequest.bind(friendController));
router.post('/requests/:requestId/reject', validate(friendRequestIdSchema, 'params'), friendController.rejectRequest.bind(friendController));

export default router;
