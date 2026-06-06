import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import conversationRoutes from './conversation.routes';
import messageRoutes from './message.routes';
import groupRoutes from './group.routes';
import notificationRoutes from './notification.routes';
import mediaRoutes from './media.routes';
import aiRoutes from './ai.routes';
import friendRoutes from './friend.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/messages', messageRoutes);
router.use('/groups', groupRoutes);
router.use('/notifications', notificationRoutes);
router.use('/media', mediaRoutes);
router.use('/ai', aiRoutes);
router.use('/friends', friendRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

export default router;
