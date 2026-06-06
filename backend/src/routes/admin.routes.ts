import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.MODERATOR));

router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:userId/toggle-active', adminController.toggleUserActive.bind(adminController));
router.get('/groups', adminController.getGroups.bind(adminController));
router.get('/analytics', adminController.getAnalytics.bind(adminController));
router.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

export default router;
