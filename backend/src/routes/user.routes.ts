import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, searchUsersSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile.bind(userController));
router.patch('/me', validate(updateProfileSchema), userController.updateProfile.bind(userController));
router.get('/search', validate(searchUsersSchema, 'query'), userController.searchUsers.bind(userController));
router.get('/:userId', userController.getUserById.bind(userController));

export default router;
