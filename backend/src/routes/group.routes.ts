import { Router } from 'express';
import { groupController } from '../controllers/group.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createGroupSchema,
  updateGroupSchema,
  groupIdSchema,
  addMemberSchema,
} from '../validators/group.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(createGroupSchema), groupController.createGroup.bind(groupController));
router.get('/:groupId', validate(groupIdSchema, 'params'), groupController.getGroup.bind(groupController));
router.patch('/:groupId', validate(groupIdSchema, 'params'), validate(updateGroupSchema), groupController.updateGroup.bind(groupController));
router.post('/:groupId/members', validate(groupIdSchema, 'params'), validate(addMemberSchema), groupController.addMember.bind(groupController));
router.delete('/:groupId/members/:userId', validate(groupIdSchema, 'params'), groupController.removeMember.bind(groupController));

export default router;
